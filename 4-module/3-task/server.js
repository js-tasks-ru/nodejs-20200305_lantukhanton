const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

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
    case 'DELETE':
      checkNestedPath(res, pathName);
      fs.unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            generateServerRes(res, 404, 'Not Found');
          } else {
            generateServerRes(res, 500, 'Server Error');
          }
        } else {
          generateServerRes(res, 200, 'Ok');
        }
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
