const { getValueByPath } = require('../tools');

module.exports = class Minimum {
    constructor(path) {
        this.path = path;
        this.current = null;
    }

    update(obj) {
        const value = getValueByPath(obj, this.path);
        if (!value) return;

        this.current = this.current === null ? value : Math.min(this.current, value);
    }

    get() {
        return this.current;
    }
};
