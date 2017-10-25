const should = require('should');
const mongoose = require('mongoose');
const config = require('../../config');
const History = require('../history.model');
const historyController = require('../history.controller');

let diffs;
let questionId;

describe('History Controller', () => {
  before(async () => {
    mongoose.connect(config.MONGODB_URL);
    await History.remove({});
    questionId = mongoose.Types.ObjectId().toString();
    const oldJson = { questionId, concept: 'Two Way Binding' };
    const newJson = { questionId, concept: 'Two Way Binding in AngularJS' };
    diffs = historyController.calculateDiffs(oldJson, newJson);
  });

  it('Should calculate diffs', () => {
    should.exist(diffs);
    diffs.should.be.an.instanceof(Array);
    diffs.length.should.be.exactly(1);
    diffs[0].should.have.property('op');
    diffs[0].value.should.be.exactly('Two Way Binding in AngularJS');
  });

  it('Should storeDiffs', async () => {
    const storedChangeSet = await historyController.storeDiffs({ questionId, changes: diffs });
    should.exist(storedChangeSet.questionId);
    should.exist(storedChangeSet.changes);
    should.exist(storedChangeSet.createdAt);
    should.exist(storedChangeSet.updatedAt);
    should.exist(storedChangeSet);
  });

  after(async () => {
    await History.remove({});
    await mongoose.connection.close();
  });
});
