const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (path.dirname(pathname) !== '.') {
    res.statusCode = 400;
    res.end('Nested directories are not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const readFileStream = fs.createReadStream(filepath);
      readFileStream.on('error', ({code}) => {
        if (code === 'ENOENT') {
          res.statusCode = 404;
          res.end('No file');
        }
        res.statusCode = 500;
        res.end('Unexpected error');
      });

      readFileStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
