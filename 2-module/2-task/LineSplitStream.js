const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lineCombiner = '';
  }

  _transform(chunk, encoding, callback) {
    this.lineCombiner += chunk.toString();
    callback();
  }

  _flush(callback) {
    this.lineCombiner.split(os.EOL).map(item => {
      this.push(item);
    });
    callback();
  }
}

module.exports = LineSplitStream;
