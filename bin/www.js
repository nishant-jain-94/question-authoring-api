const http = require('http');
const bunyan = require('bunyan');
const mongoose = require('mongoose');
const Neo4jWrapper = require('simple-neo4j-wrapper');


const logger = bunyan.createLogger({ name: 'bin/www' });
const app = require('../app');
const config = require('../config');

const port = config.PORT;
app.set('port', port);

Neo4jWrapper(config.NEO4J_URL, config.NEO4J_USERNAME, config.NEO4J_PASSWORD);
mongoose.connect(config.MONGODB_URL);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
  logger.info(`Server listening on port ${port}`);
});
