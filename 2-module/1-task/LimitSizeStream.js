const {Transform} = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor({limit, ...options}) {
    super(options);
    this.limit = limit;
    this.aggregatedSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.aggregatedSize += chunk.length;
    if (this.aggregatedSize <= this.limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
