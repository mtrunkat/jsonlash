const { Transform } = require('stream');

class JsonParse extends Transform {
    constructor({ debug }) {
        super({ objectMode: true });

        this.debug = debug;
    }

    _transform(chunk, encoding, callback) {
        const str = chunk.toString();
        let obj;

        try {
            const trimmed = str.slice(str.indexOf('{'));
            obj = JSON.parse(trimmed);
        } catch (err) {
            if (this.debug) console.log(`WARNING: Invalid JSON line: ${str}`);
        }

        callback(null, obj);
    }
}

module.exports = JsonParse;
