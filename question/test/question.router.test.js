const fs = require('fs');
const path = require('path');
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const config = require('../../config');

const app = require('../../app');

const mockedQuestion = fs.readFileSync(path.join(__dirname, 'mockQuestion.md'), 'utf8');

let initializedQuestion;
let publishedQuestion;

describe('Question Router', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should GET an initialized question', (done) => {
    request(app)
      .get('/question/initialize')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.property('id');
        res.body.id.should.be.an.instanceOf(String);
        res.body.should.have.property('question');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        initializedQuestion = res.body;
        done();
      });
  });

  it('Should publish a question', (done) => {
    initializedQuestion.question = {
      rawMdQuestion: mockedQuestion,
    };
    request(app)
      .post('/question/publish')
      .send(initializedQuestion)
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
        publishedQuestion.question.rawMdQuestion.should.not.be.null();
        publishedQuestion.question.rawMdQuestion.should.be.an.instanceOf(String);
        publishedQuestion.id.should.be.exactly(initializedQuestion.id);
        done();
      });
  });

  it('Should GET the question using questionId', (done) => {
    request(app)
      .get(`/question/${initializedQuestion.id}`)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        should.exist(res.body);
        const fetchedQuestion = res.body;
        JSON.stringify(publishedQuestion).should.be.exactly(JSON.stringify(fetchedQuestion));
        done();
      });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
