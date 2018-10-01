const _ = require('underscore');
const { Transform } = require('stream');
const { getValueByPath } = require('../tools');

const FILTER_REGEX = /^([a-zA-Z0-9.]+)(>=|<=|=|>|<)['|"]{0,1}(.*)['|"]{0,1}$/;
const OPERATORS = {
    GT: '>',
    GTE: '>=',
    LT: '<',
    LTE: '<=',
    EQ: '=',
};

const parseFilter = (filter) => {
    const [, pathStr, operator, value] = filter.match(FILTER_REGEX);
    const path = pathStr.split('.');

    if (!pathStr.length || !operator || !value) throw new Error(`Invalid filter: "${filter}"`);
    if (!Object.values(OPERATORS).includes(operator)) throw new Error(`Invalid operator: "${operator}"`);

    return { path, value, operator };
};

const matches = (left, right, operator) => {
    switch (operator) {
        // Use weak operators here!
        case OPERATORS.GT: return left > right;
        case OPERATORS.GTE: return left >= right;
        case OPERATORS.LT: return left < right;
        case OPERATORS.LTE: return left <= right;
        case OPERATORS.EQ: return left == right; // eslint-disable-line
        default: throw new Error(`Invalid operator: "${operator}"`);
    }
};

class Filter extends Transform {
    constructor(filters) {
        super({ objectMode: true });

        this.filters = filters.map(parseFilter);
    }

    _transform(obj, encoding, callback) {
        const matchesFilter = _.every(this.filters, ({ path, operator, value }) => {
            const givenValue = getValueByPath(obj, path);

            return matches(givenValue, value, operator);
        });

        if (matchesFilter) callback(null, obj);
        else callback();
    }
}

module.exports = Filter;
