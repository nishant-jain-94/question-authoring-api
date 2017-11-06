const bunyan = require('bunyan');
const express = require('express');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');

const ping = require('./ping');
const draft = require('./draft');
const question = require('./question');
const history = require('./history');

const app = express();
const logger = bunyan.createLogger({ name: 'Question-Authoring-API' });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
app.use('/questions/draft', draft);

module.exports = app;
