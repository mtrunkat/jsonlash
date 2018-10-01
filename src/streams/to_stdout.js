const { Writable } = require('stream');

class ToStdout extends Writable {
    constructor(clearOnMessage) {
        super();
        this.clearOnMessage = clearOnMessage;
    }

    _write(chunk, encoding, callback) {
        if (this.clearOnMessage) process.stdout.write('\x1Bc');
        process.stdout.write(`${chunk}\n`);
        callback();
    }
}

module.exports = ToStdout;
