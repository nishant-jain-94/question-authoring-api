const should = require('should');
const mongoose = require('mongoose');
const config = require('../../config');
const Question = require('../draft.model');

let draftedQuestion;
describe('Question Model\'s', () => {
  before(async () => {
    // Opening the MongoDB Connection
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should be able to draft a question', async () => {
    const question = {};
    draftedQuestion = await Question.draft(question);
    should.exist(draftedQuestion);
    draftedQuestion.should.have.property('createdAt');
    draftedQuestion.should.have.property('updatedAt');
    draftedQuestion.should.have.property('id').which.is.a.String();
    draftedQuestion.should.have.property('_id').which.is.a.Object();
    draftedQuestion.should.have.propertyByPath('author', 'name').eql('Anonymous');
    draftedQuestion.should.have.propertyByPath('author', 'userId').eql('Anonymous');
  });

  it('Should be able to update a draft question', async () => {
    draftedQuestion.concept = 'Two Way Binding in AngularJS';
    const updatedQuestion = await Question.draft(draftedQuestion);
    should.exist(updatedQuestion);
    updatedQuestion.should.have.property('concept');
    updatedQuestion.should.have.property('createdAt');
    updatedQuestion.should.have.property('updatedAt');
    updatedQuestion.should.have.property('id').which.is.a.String();
    updatedQuestion.should.have.property('_id').which.is.a.Object();
    updatedQuestion.should.have.propertyByPath('author', 'name').eql('Anonymous');
    updatedQuestion.should.have.propertyByPath('author', 'userId').eql('Anonymous');
  });

  it('Should fetch all the question under draft', async () => {
    const draftedQuestions = await Question.fetch();
    should.exist(draftedQuestions);
    draftedQuestions.should.be.an.instanceOf(Array);
    const [question] = draftedQuestions;
    question.should.have.property('createdAt');
    question.should.have.property('updatedAt');
    question.should.have.property('id').which.is.a.String();
    question.should.have.property('_id').which.is.a.Object();
    question.should.have.propertyByPath('author', 'name').eql('Anonymous');
    question.should.have.propertyByPath('author', 'userId').eql('Anonymous');
  });

  it('Should be able to delete questions under draft', async () => {
    const draftedQuestions = await Question.fetch();
    const [question] = draftedQuestions;
    const deletedQuestion = await Question.deleteDrafts([question.id]);
    deletedQuestion.result.n.should.be.exactly(1);
  });

  after(async () => {
    // Clearing the Question Collection.
    await Question.remove({});
    // Closing the Mongoose Connection.
    await mongoose.connection.close();
  });
});
