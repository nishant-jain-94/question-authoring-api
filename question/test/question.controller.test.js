const fs = require('fs');
const path = require('path');
const should = require('should');
const mongoose = require('mongoose');
const config = require('../../config');
const Question = require('../question.model');
const questionController = require('../question.controller');

const rawMdQuestion = fs.readFileSync(path.join(__dirname, './mockQuestion.md'), 'utf8');

describe('Question Controller', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should Initialize Question', async () => {
    const initializedQuestion = await questionController.initQuestion();
    should.exist(initializedQuestion);
    initializedQuestion.should.have.property('id');
    initializedQuestion.should.have.property('question');
  });

  it('Should Publish Question', async () => {
    const initializedQuestion = await questionController.initQuestion();
    initializedQuestion.question.rawMdQuestion = rawMdQuestion;
    const publishedQuestion = await questionController.publishQuestion(initializedQuestion);
    should.exist(publishedQuestion);
  });

  after(async () => {
    await Question.remove({});
    await mongoose.connection.close();
  });
});
