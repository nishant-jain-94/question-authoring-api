const fs = require('fs');
const path = require('path');
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const Neo4jWrapper = require('simple-neo4j-wrapper');

const config = require('../../config');
const app = require('../../app');
const Question = require('../question.model');

const mdQuestion = fs.readFileSync(path.join(__dirname, 'mockQuestion.md'), 'utf8');
let publishedQuestion;

describe('Question Router', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
    await new Neo4jWrapper(config.NEO4J_URL, config.NEO4J_USERNAME, config.NEO4J_PASSWORD);
  });

  it('Should publish a question', (done) => {
    const question = {
      concept: 'Two Way Binding',
      content: 'Introduction to Two Way Binding',
      questionType: 'Multiple Choice Question',
      player: 'mcq-player',
      evaluator: 'mcq-evaluator',
      expectedOutcome: 'Remember',
      question: {
        mdQuestion,
      },
      answer: {
        content: 'Option-1',
      },
    };

    request(app)
      .post('/question')
      .send(question)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        publishedQuestion = res.body;
        publishedQuestion._id.should.not.be.null();
        publishedQuestion._id.should.be.an.instanceOf(String);
        publishedQuestion.createdAt.should.not.be.null();
        publishedQuestion.createdAt.should.be.an.instanceOf(String);
        publishedQuestion.updatedAt.should.not.be.null();
        publishedQuestion.updatedAt.should.be.an.instanceOf(String);
        publishedQuestion.id.should.not.be.null();
        publishedQuestion.id.should.be.an.instanceOf(String);
        publishedQuestion.question.should.not.be.null();
        publishedQuestion.question.should.be.an.instanceOf(Object);
        publishedQuestion.question.mdQuestion.should.not.be.null();
        publishedQuestion.question.mdQuestion.should.be.an.instanceOf(String);
        done();
      });
  });

  it('Should GET all the questions', (done) => {
    request(app)
      .get('/question')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res.body);
        const fetchedQuestions = res.body;
        fetchedQuestions.should.be.a.instanceOf(Array);
        fetchedQuestions.length.should.be.exactly(1);
        fetchedQuestions[0].should.have.property('id');
        fetchedQuestions[0].should.have.property('concept');
        fetchedQuestions[0].concept.should.be.exactly('Two Way Binding');
        fetchedQuestions[0].content.should.be.exactly('Introduction to Two Way Binding');
        fetchedQuestions[0].should.have.property('content');
        done();
      });
  });

  it('Should get all the questions matching the concept', async () => {
    request(app)
      .get('/question?concept=Two%20Way%20Binding')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res.body);
        res.body.should.be.a.instanceOf(Array);
        res.body.length.should.be.exactly(1);
        res.body[0].concept.should.be.exactly('Two Way Binding');
        res.body[0].content.should.be.exactly('Introduction to Two Way Binding');
      });
  });

  it('Should return an empty array if there are no results matching the criteria', (done) => {
    request(app)
      .get('/question?concept=TwoWayBinding')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res.body);
        res.body.should.be.a.instanceOf(Array);
        res.body.length.should.be.exactly(0);
        done();
      });
  });

  after(async () => {
    await Question.remove({});
    await mongoose.connection.close();
    await Neo4jWrapper.sessions.get(config.NEO4J_URL).close();
    await Neo4jWrapper.drivers.get(config.NEO4J_URL).close();
  });
});
