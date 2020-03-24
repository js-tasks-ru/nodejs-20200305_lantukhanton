const {Transform} = require('stream');
const os = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super({...options, encoding: 'utf-8'});
    this.rest = '';
  }

  _transform(chunk, encoding, callback) {
    const string = this.rest + chunk.toString();
    const lines = string.split(os.EOL);
    const lastLine = lines.pop();
    this.rest = '';

    lines.forEach((l) => this.push(l));

    if (string.endsWith(os.EOL)) {
      this.push(lastLine);
    } else {
      this.rest = lastLine;
    }

    callback(null);
  }

  _flush(callback) {
    callback(null, this.rest);
  }
}

module.exports = LineSplitStream;
