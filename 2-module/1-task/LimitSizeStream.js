const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.counter = 0;
  }

  _transform(chunk, encoding, callback) {
    this.counter += chunk.length;

    if (this.counter > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.push(chunk);
      callback();
    }
  }
}

module.exports = LimitSizeStream;
