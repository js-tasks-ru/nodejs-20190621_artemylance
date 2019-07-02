const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  // try {
  //   filepath = decodeURIComponent(filepath);
  // } catch (e) {
  //   res.statusCode = 400;
  //   res.end('Bad Request');
  // }
  //
  // if (~filepath.indexOf('/0')) {
  //   res.statusCode = 400;
  //   res.end('Bad request');
  // }

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File exists');
    return;
  }

  switch (req.method) {
    case 'POST':
      const streamLimiter = new LimitSizeStream({limit: 1000000});
      const writeStream = fs.createWriteStream(filepath);

      req.pipe(streamLimiter).pipe(writeStream);

      streamLimiter.on('error', () => {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
        });
        res.statusCode = 413;
        res.end('Large file');
      });

      req.on('aborted', () => {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
        });
        res.statusCode = 500;
        res.end('Lost connection');
      });

      writeStream.on('error', (err) => {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
        });
        res.statusCode = 500;
        res.end(err);
      }).on('finish', () => {
        res.statusCode = 201;
        res.end('File created');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
