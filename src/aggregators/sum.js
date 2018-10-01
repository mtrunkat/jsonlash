const { getValueByPath } = require('../tools');

module.exports = class Sum {
    constructor(path) {
        this.path = path;
        this.sum = null;
    }

    update(obj) {
        const value = getValueByPath(obj, this.path);
        if (!value) return;

        this.sum = this.sum === null ? value : this.sum + value;
    }

    get() {
        return this.sum;
    }
};
