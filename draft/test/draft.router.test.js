const should = require('should');
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const config = require('../../config');
const Draft = require('../draft.model');

let fetchedQuestions;

describe('Draft API', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should be able to create a new Draft', (done) => {
    const draft = {
      concept: 'Two Way Binding in AngularJS',
      question: {
        mdQuestion: 'This is a raw md question',
      },
    };

    request(app)
      .post('/questions/draft')
      .type('form')
      .send(draft)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.property('id');
        res.body.should.have.property('_id');
        res.body.should.have.property('concept');
        res.body.should.have.property('question');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        done();
      });
  });

  it('Should be able to get all the drafts', (done) => {
    request(app)
      .get('/questions/draft')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        fetchedQuestions = res.body;
        fetchedQuestions.should.be.instanceOf(Array);
        fetchedQuestions.should.have.property('length');
        done();
      });
  });

  it('Should be able to delete drafts', (done) => {
    request(app)
      .delete('/questions/draft')
      .send(fetchedQuestions)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res.body);
        res.body.n.should.be.exactly(1);
        done();
      });
  });

  after(async () => {
    await Draft.remove({});
    await mongoose.connection.close();
  });
});
