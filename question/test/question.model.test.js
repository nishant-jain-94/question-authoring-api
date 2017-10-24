const should = require('should');
const mongoose = require('mongoose');
const config = require('../../config');
const Question = require('../question.model');

describe('Question Model\'s', () => {
  before(() => {
    // Opening the MongoDB Connection
    mongoose.connect(config.MONGODB_URL);
  });

  it('Should initialize a question using init method', async() => {
    const initializedEmptyQuestion = await Question.init();
    should.exist(initializedEmptyQuestion);
  });

  it('Should patch a question object using patch method', async() => {
    const initializedEmptyQuestion = await Question.init();
    initializedEmptyQuestion.question.rawMdQuestion = "# Question";
    const patchedQuestion = await Question.patch(initializedEmptyQuestion);
    should.exist(patchedQuestion);
  });

  after(async() => {
    // Clearing the Question Collection. 
    await Question.remove({});
    // Closing the Mongoose Connection.
    mongoose.connection.close();
  });
});