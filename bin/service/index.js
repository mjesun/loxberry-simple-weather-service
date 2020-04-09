'use strict';

const http = require('http');
const querystring = require('querystring');

const forecast = require('./handlers/forecast');
const raw = require('./handlers/raw');
const restart = require('./handlers/restart');

const headers = {
  'Content-Type': 'text/plain; charset=utf-8',
};

Error.stackTraceLimit = Infinity;

http
  .createServer(async (req, res) => {
    try {
      const url = req.url.substr(0, req.url.indexOf('?'));
      const query = querystring.parse(req.url.substr(url.length + 1));

      switch (true) {
        case /\/forecast(?:\/|$)/.test(url):
          res.writeHead(200, headers);
          res.end(await forecast(url, query));
          break;

        case /\/raw(?:\/|$)/.test(url):
          res.writeHead(200, headers);
          res.end(await raw(url, query));
          break;

        case /\/restart(?:\/|$)/.test(url):
          res.writeHead(200, headers);
          res.end(await restart(url, query));
          break;

        default:
          res.writeHead(404, headers);
          res.end();
          break;
      }
    } catch (err) {
      res.writeHead(500, headers);
      res.end(err.stack);
    }
  })
  .listen(6066);
