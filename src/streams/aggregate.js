const { Transform } = require('stream');
const Table = require('cli-table');
const { getValueByPath } = require('../tools');
const { AGGREGATION_CLASSES } = require('../consts');

const EMIT_INTERVAL_MILLIS = 1000;

class Aggregate extends Transform {
    constructor(paths, aggregators) {
        super({ objectMode: true });

        this.parsedPaths = paths.map(path => path.split('.'));
        this.aggregators = aggregators;
        this.lines = {};
        this.startedAt = Date.now();
        this.total = 0;
        this.head = paths
            .concat(['total'])
            .concat(this.aggregators.map(({ field, aggregator }) => `${aggregator.toUpperCase()}(${field})`));

        setInterval(() => this._emit(), EMIT_INTERVAL_MILLIS);
    }

    _transform(obj, encoding, callback) {
        const pathValues = [];
        const key = this.parsedPaths
            .map((path) => {
                const value = getValueByPath(obj, path);
                const str = value === null ? 'null' : value.toString();

                pathValues.push(str);

                return str;
            })
            .join('_');

        if (!this.lines[key]) {
            this.lines[key] = { pathValues, aggregators: [], total: 0 };
            this.aggregators
                .forEach(({ field, aggregator }) => {
                    this.lines[key].aggregators.push(new AGGREGATION_CLASSES[aggregator](field.split('.')));
                });
        }

        this.total++;
        this.lines[key].total++;
        this.lines[key].aggregators.forEach(aggregator => aggregator.update(obj));

        callback(null);
    }

    _emit() {
        const durationSecs = Math.round((Date.now() - this.startedAt) / 1000);
        const table = this._createTable();

        this.push(`${this.total} lines in ${durationSecs} seconds \n${table.toString()}`);
    }

    _createTable() {
        const aggregated = Object.values(this.lines).map(({ pathValues, aggregators, total }) => {
            const aggregatorValues = aggregators.map((aggregator) => {
                const value = aggregator.get();

                return value === null ? 'N/A' : value;
            });

            return pathValues.concat([total]).concat(aggregatorValues);
        });

        const table = new Table({ head: this.head });
        table.push(...aggregated);

        return table;
    }
}

module.exports = Aggregate;
