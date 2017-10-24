const http = require('http');
const bunyan = require('bunyan');
const mongoose = require('mongoose');

const logger = bunyan.createLogger({ name: 'bin/www' });
const app = require('../app');
const config = require('../config');

const port = config.PORT;
app.set('port', port);
mongoose.connect(config.MONGODB_URL);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
  logger.info(`Server listening on port ${port}`);
});
