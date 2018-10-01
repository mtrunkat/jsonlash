const { Transform } = require('stream');

const INDENTATION = 2;

class JsonStringify extends Transform {
    constructor(expand) {
        super({ objectMode: true });

        this.expand = expand;
    }

    _transform(obj, encoding, callback) {
        callback(null, this._stringify(obj));
    }

    _stringify(obj) {
        return this.expand
            ? JSON.stringify(obj, null, INDENTATION)
            : JSON.stringify(obj);
    }
}

module.exports = JsonStringify;
