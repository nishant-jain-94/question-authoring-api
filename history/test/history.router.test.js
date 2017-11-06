const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const jdr = require('json-diff-rfc6902');

const config = require('../../config');
const History = require('../history.model');
const app = require('../../app');

const questionId = mongoose.Types.ObjectId().toString();

describe('History Router', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
    const newQuestion = {
      id: questionId,
      concept: 'Two Way Binding',
      content: 'Introduction to Two Way Binding',
      author: {
        name: 'Nishant Jain',
        userId: mongoose.Types.ObjectId(),
      },
      player: 'mcq-player',
      evaluator: 'self',
      expectedOutcome: 'Remember',
      question: {
        rawMdQuestion: '# Question\n What is the difference between React and AngularJS',
      },
    };

    const changes = jdr.diff({ }, newQuestion);
    const changeSet = { questionId, changes };
    await History.insert(changeSet);
  });

  it('Should be able to retrieve all changeSets for a question', (done) => {
    request(app)
      .get(`/history/${questionId}`)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.be.instanceOf(Array);
        res.body.length.should.be.exactly(1);
        done();
      });
  });

  after(async () => {
    await History.remove({});
    await mongoose.connection.close();
  });
});
