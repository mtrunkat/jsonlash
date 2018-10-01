const { Transform } = require('stream');
const { EOL } = require('os');

class SplitByLine extends Transform {
    constructor() {
        super();

        this.unfinishedLine = false;
    }

    _transform(chunk, encoding, callback) {
        const lines = (this.unfinishedLine + chunk.toString()).split(EOL);

        this.unfinishedLine = lines[lines.length - 1].trim() !== ''
            ? lines.pop()
            : '';

        lines.forEach((line) => {
            this.push(line);
        });

        callback();
    }
}

module.exports = SplitByLine;
