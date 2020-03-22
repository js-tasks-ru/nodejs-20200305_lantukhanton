const {Transform} = require('stream');
const os = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super({...options, encoding: 'utf-8'});
    this.rest = '';
  }

  _transform(chunk, encoding, callback) {
    if (chunk.indexOf(os.EOL) !== -1) {
      const [data, ...rest] = chunk.toString().split(os.EOL);

      this.push(this.rest + data);
      this.rest = rest.join('');
      callback(null);
    } else {
      this.rest = this.rest + chunk.toString();
      callback(null);
    }
  }

  _flush(callback) {
    callback(null, this.rest);
  }
}

module.exports = LineSplitStream;
