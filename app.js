const bunyan = require('bunyan');
const express = require('express');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');

const ping = require('./ping');
const question = require('./question');
const history = require('./history');

const app = express();
const logger = bunyan.createLogger({ name: 'Question-Authoring-API' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bunyanMiddleware({
  headerName: 'X-Request-Id',
  propertyName: 'reqId',
  logName: 'req_id',
  obscureHeaders: [],
  logger,
  requestStart: true,
}));

app.use('/ping', ping);
app.use('/history', history);
app.use('/question', question);

module.exports = app;
