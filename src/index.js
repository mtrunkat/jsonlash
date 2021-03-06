const { Command, flags } = require('@oclif/command');
const _ = require('underscore');

const { AGGREGATION_TYPES } = require('./consts');
const Aggregate = require('./streams/aggregate');
const Filter = require('./streams/filter');
const JsonParse = require('./streams/json_parse');
const JsonStringify = require('./streams/json_stringify');
const SplitByLine = require('./streams/split_by_line');
const ToStdout = require('./streams/to_stdout');

class JsonlashCommand extends Command {
    async run() {
        const parsed = this.parse(JsonlashCommand);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        let stream = process.stdin
            .pipe(new SplitByLine())
            .pipe(new JsonParse({ debug: parsed.flags.debug }));

        if (parsed.flags.filter) stream = stream.pipe(new Filter(parsed.flags.filter));
        if (parsed.flags.aggregate) {
            const aggregators = _
                .chain(parsed.flags)
                .pick(_.values(AGGREGATION_TYPES))
                .mapObject((fields, aggregator) => fields.map(field => ({ field, aggregator })))
                .toArray()
                .flatten()
                .value();

            stream
                .pipe(new Aggregate(parsed.flags.aggregate, aggregators))
                .pipe(new ToStdout(true));
        } else {
            stream
                .pipe(new JsonStringify(!!parsed.flags.expand))
                .pipe(new ToStdout());
        }
    }
}

JsonlashCommand.description = `This is a simple command line tool to filter and aggregate JSONL (json-lines) streams.

Simply pipe in any JSONL stream and with filter and/or aggregation flags.

If you use only --filter flag then jsonlash outputs filtered jsonl stream.

If you also use --aggregate flag then it renders a table with aggregated data.
Additionally you may add one or more --min|--max|--sum|---avg|--uni flags to
compute aggregated values of given fields.

EXAMPLES

... | jsonlash -f 'msg=API call' -e
... | jsonlash -f 'req.duration>10000' -a req.routeName --uni req.user.id
... | jsonlash -a req.method -a req.routeName --max req.duration --avg req.duration
`;

JsonlashCommand.flags = {
    version: flags.version({
        char: 'v',
    }),
    help: flags.help({
        char: 'h',
    }),
    filter: flags.string({
        char: 'f',
        description: 'filter JSONL items',
        multiple: true,
    }),
    aggregate: flags.string({
        char: 'a',
        description: 'aggregate JSONL items',
        multiple: true,
    }),

    // These are extra parameters for aggregation.
    [AGGREGATION_TYPES.min]: flags.string({ dependsOn: ['aggregate'], multiple: true, description: 'aggregate minimum value over all occurances of given field' }),
    [AGGREGATION_TYPES.max]: flags.string({ dependsOn: ['aggregate'], multiple: true, description: 'aggregate maximum value over all occurances of given field' }),
    [AGGREGATION_TYPES.sum]: flags.string({ dependsOn: ['aggregate'], multiple: true, description: 'aggregate sum over all occurances of given field' }),
    [AGGREGATION_TYPES.avg]: flags.string({ dependsOn: ['aggregate'], multiple: true, description: 'aggregate average value over all occurances of given field' }),
    [AGGREGATION_TYPES.uni]: flags.string({ dependsOn: ['aggregate'], multiple: true, description: 'aggregate number of unique occurances of given field' }),


    expand: flags.boolean({
        char: 'e',
        description: 'expand outputted JSON',
        exclusive: ['aggregate'],
    }),
    debug: flags.boolean({
        char: 'd',
        description: 'debug mode, shows JSON parsing errors',
        multiple: false,
        exclusive: ['aggregate'],
    }),
};

module.exports = JsonlashCommand;
