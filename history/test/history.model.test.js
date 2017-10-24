const should = require('should');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('../../config');
const jdr = require('json-diff-rfc6902');
const History = require('../history.model.js');

const oldQuestion = {
  questionId: mongoose.Types.ObjectId().toString()
};

const newQuestion = {
  questionId: oldQuestion.questionId,
  concept: 'Two Way Binding',
  content: 'Introduction to Two Way Binding',
  author: {
    name: 'Nishant Jain',
    userId: mongoose.Types.ObjectId()
  },
  player: 'mcq-player',
  evaluator: 'self',
  expectedOutcome: 'Remember',
  question: {
    rawMdQuestion: "# Question\n What is the difference between React and AngularJS"
  }
};

describe('History Model', () => {
  before(async() => {
    mongoose.connect(config.MONGODB_URL);
    await History.remove({});
  });
  
  it('insert method should insert changeSets in the History collection', async() => {    
    const changes = jdr.diff(oldQuestion, newQuestion);
    const questionId = oldQuestion.questionId;
    const changeSet = { questionId, changes };
    const insertedHistory = await History.insert(changeSet);
    should.exist(insertedHistory);
    insertedHistory.should.have.property('questionId');
    questionId.should.be.exactly(insertedHistory.questionId.toString());
    insertedHistory.changes.should.be.an.instanceOf(Array);
    insertedHistory.changes.forEach((change) => {
      change.should.have.property('op');
    });
    insertedHistory.should.have.property('createdAt');
    insertedHistory.should.have.property('updatedAt');
  });
  
  it('fetch method should fetch changeSets from the History Collection', async() => {
    const results = await History.fetch(oldQuestion.questionId);
    should.exist(results);
  });

  after(async() => {
    await History.remove({});
    await mongoose.connection.close();
  });
});