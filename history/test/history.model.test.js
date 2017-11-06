const should = require('should');
const mongoose = require('mongoose');
const config = require('../../config');
const jdr = require('json-diff-rfc6902');
const History = require('../history.model.js');

const questionId = mongoose.Types.ObjectId().toString();

describe('History Model', () => {
  before(async () => {
    mongoose.connect(config.MONGODB_URL);
    await History.remove({});
  });

  it('Should insert ChangeSets in the History collection', async () => {
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
    const insertedHistory = await History.insert(changeSet);
    should.exist(insertedHistory);
    insertedHistory.should.have.property('questionId');
    questionId.should.be.exactly(insertedHistory.questionId);
    insertedHistory.changes.should.be.an.instanceOf(Array);
    insertedHistory.changes.forEach((change) => {
      change.should.have.property('op');
    });
    insertedHistory.should.have.property('createdAt');
    insertedHistory.should.have.property('updatedAt');
  });

  it('fetch method should fetch changeSets from the History Collection', async () => {
    const results = await History.fetch(questionId);
    should.exist(results);
  });

  after(async () => {
    await History.remove({});
    await mongoose.connection.close();
  });
});
