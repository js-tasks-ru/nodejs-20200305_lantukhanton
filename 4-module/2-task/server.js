const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const generateServerRes = (res, code, message) => {
  res.statusCode = code;
  res.end(message);
};

const checkNestedPath = (res, pathName) => {
  if (path.dirname(pathName) !== '.') {
    generateServerRes(res, 400, 'Nested directories are not supported');
  }
};

server.on('request', (req, res) => {
  const pathName = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathName);

  switch (req.method) {
    case 'POST':
      checkNestedPath(res, pathName);

      const writeStream = fs.createWriteStream(filepath, {highWaterMark: 64, flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1024 * 1024});

      res.on('close', () => {
        if (res.finished) return;
        limitStream.destroy();
        writeStream.destroy();
        fs.unlink(filepath, () => {});
      });

      writeStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          generateServerRes(res, 409, 'File already exists');
        } else {
          generateServerRes(res, 500, 'Server error');
          fs.unlink(filepath, () => {});
        }
      });

      limitStream.on('error', (err) => {
        writeStream.destroy();
        if (err.code === 'LIMIT_EXCEEDED') {
          generateServerRes(res, 413, 'Max size is 1Mb');
          fs.unlink(filepath, () => {});
        }
      });

      writeStream.on('close', () => {
        generateServerRes(res, 201, 'Ok');
      });

      req.pipe(limitStream).pipe(writeStream);
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
