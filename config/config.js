const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://prod_mongodb/assessment_item',
  NEO4J_URL: process.env.NEO4J_URL || 'bolt://graphdb',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
};

module.exports = config;
