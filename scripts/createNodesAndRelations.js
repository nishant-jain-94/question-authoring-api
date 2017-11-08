const path = require('path');
const async = require('async');
const bunyan = require('bunyan');
const Neo4jWrapper = require('simple-neo4j-wrapper');

const logger = bunyan.createLogger({ name: 'CreateNodesAndRelationships' });
const neo4j = new Neo4jWrapper('bolt://localhost:7690', 'neo4j', 'password');

// Gets the absolute path to nodes.csv
const pathToNodes = path.join(__dirname, 'nodes.csv');
// Gets the absolute path to relations.csv
const pathToRelations = path.join(__dirname, 'relations.csv');

// Creates Nodes and Relations in series using pathToNodes and pathToRelations
async.series([
  neo4j.createNodesFromCsv.bind(neo4j, pathToNodes),
  neo4j.createRelationsFromCsv.bind(neo4j, pathToRelations),
], (err, results) => {
  logger.info({ results });
  process.exit(0);
});
