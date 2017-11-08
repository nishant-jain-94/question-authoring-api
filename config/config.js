const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL: process.env.MONGODB_URL || 'prod_mongodb:29017/assessment_item',
  NEO4J_URL: process.env.NEO4J_URL || 'bolt://graphdb:7690',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
};

module.exports = config;
