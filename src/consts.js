const Minimum = require('./aggregators/minimum');
const Maximum = require('./aggregators/maximum');
const Sum = require('./aggregators/sum');
const Average = require('./aggregators/average');
const Uniques = require('./aggregators/uniques');

exports.AGGREGATION_TYPES = {
    min: 'min',
    max: 'max',
    sum: 'sum',
    avg: 'avg',
    uni: 'uni',
};

exports.AGGREGATION_CLASSES = {
    min: Minimum,
    max: Maximum,
    sum: Sum,
    avg: Average,
    uni: Uniques,
};

exports.DEFAULT_AGGREGATION_TYPE = 'COUNT';
