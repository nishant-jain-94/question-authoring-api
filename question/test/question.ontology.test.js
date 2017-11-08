const path = require('path');
const should = require('should');
const { promisify } = require('util');
const Ontology = require('../question.ontology.js');

const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../../config');

const Neo4jWrapper = require('simple-neo4j-wrapper');

const pathToNodes = path.join(__dirname, '../../scripts/nodes.csv');
const pathToRelations = path.join(__dirname, '../../scripts/relations.csv');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);
const createNodesFromCsv = promisify(neo4j.createNodesFromCsv.bind(neo4j));
const createRelationsFromCsv = promisify(neo4j.createRelationsFromCsv.bind(neo4j));
const deleteAllNodes = promisify(neo4j.deleteAllNodes.bind(neo4j));

describe('Question Ontology', () => {
  before(async () => {
    await deleteAllNodes();
    await createNodesFromCsv(pathToNodes);
    await createRelationsFromCsv(pathToRelations);
  });

  it('Should be able to fetch questions from graph', async () => {
    const questionIds = await Ontology.fetchQuestions('Javascript MEAN FullStack');
    should.exist(questionIds);
    questionIds.should.be.an.instanceOf(Array);
  });

  it('Should be able to create question node', async () => {
    const question = {
      id: 'Q0001',
      concept: 'Two Way Binding in AngularJS',
      content: 'Two Way DataBinding in AngularJS',
    };
    const results = await Ontology.createQuestionNode(question);
    should.exist(results);
    const { records } = results;
    records.length.should.be.exactly(1);
    records[0].length.should.be.exactly(3);
    const [concept, content, questionNode] = records[0]._fields;
    concept.properties.name.should.be.exactly(question.concept);
    content.properties.name.should.be.exactly(question.content);
    questionNode.properties.id.should.be.exactly(question.id);
  });

  after(async () => {
    await deleteAllNodes();
    await Neo4jWrapper.sessions.get(NEO4J_URL).close();
    await Neo4jWrapper.drivers.get(NEO4J_URL).close();
  });
});
