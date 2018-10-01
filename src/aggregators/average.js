const { getValueByPath } = require('../tools');

module.exports = class Average {
    constructor(path) {
        this.path = path;
        this.average = 0;
        this.count = 0;
    }

    update(obj) {
        const value = getValueByPath(obj, this.path);
        if (!value) return;

        this.average = ((this.average * this.count) + value) / (this.count + 1);
        this.count++;
    }

    get() {
        return this.average;
    }
};
