const should = require('should');
const mongoose = require('mongoose');
const Draft = require('../draft.model');

const DraftController = require('../draft.controller');
const config = require('../../config');

describe('Draft Controller', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should be able to draft a question', async () => {
    const draft = {};
    const draftedQuestion = await DraftController.draftQuestion(draft);
    should.exist(draftedQuestion);
    draftedQuestion.should.have.property('createdAt');
    draftedQuestion.should.have.property('updatedAt');
    draftedQuestion.should.have.property('id').which.is.a.String();
    draftedQuestion.should.have.property('_id').which.is.a.Object();
    draftedQuestion.should.have.propertyByPath('author', 'name').eql('Anonymous');
    draftedQuestion.should.have.propertyByPath('author', 'userId').eql('Anonymous');
  });

  it('Should be able to fetch drafts', async () => {
    const draftedQuestions = await DraftController.fetchDrafts();
    should.exist(draftedQuestions);
  });

  it('Should be able to delete drafts', async () => {
    const draftedQuestions = await DraftController.fetchDrafts();
    const deletedDrafts = await DraftController.deleteDrafts([draftedQuestions]);
    should.exist(deletedDrafts);
  });

  after(async () => {
    await Draft.remove({});
    await mongoose.connection.close();
  });
});
