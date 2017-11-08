const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL: process.env.MONGODB_URL || 'localhost:29017/assessment_item',
  NEO4J_URL: process.env.NEO4J_URL || 'bolt://localhost:7690',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
};
console.log('NEO4J URL', process.env.NEO4J_URL);
module.exports = config;
