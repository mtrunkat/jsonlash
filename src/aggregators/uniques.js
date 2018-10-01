const { getValueByPath } = require('../tools');

module.exports = class Uniques {
    constructor(path) {
        this.path = path;
        this.known = new Set();
    }

    update(obj) {
        const value = getValueByPath(obj, this.path);
        if (!value) return;

        this.known.add(value);
    }

    get() {
        return this.known.size();
    }
};
