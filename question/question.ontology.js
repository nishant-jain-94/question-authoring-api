const Neo4jWrapper = require('simple-neo4j-wrapper');
const { promisify } = require('util');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);
const queryExecutor = promisify(neo4j.queryExecutor.bind(neo4j));

const fetchQuestions = async (skill) => {
  const query = `MATCH (s:skill {name: '${skill}'})-[:requires]->(c:concept)<-[:assessess]-(q:question) return q
  UNION 
  MATCH 
  (s:skill {name: '${skill}'})-[:requires]->(c:concept)<-[:subConceptOf*..5]-(sc:concept)<-[:assessess]-(q:question) 
  return q`;
  const questions = await queryExecutor(query);
  const questionIds = questions.records.map(question => question._fields[0].properties.id);
  return questionIds;
};

const createQuestionNode = async (question) => {
  try {
    const query = `
    MERGE (n:concept {name: '${question.concept}'})
    MERGE (m:content {name: '${question.content}'})
    MERGE (q:question {id: '${question.id}'})
    MERGE (n)<-[:assessess]-(q)<-[:remedies]-(m) return n, m, q`;
    const node = await queryExecutor(query);
    return node;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createQuestionNode,
  fetchQuestions,
};
