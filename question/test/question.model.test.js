const fs = require('fs');
const path = require('path');
const should = require('should');
const mongoose = require('mongoose');

const mdQuestion = fs.readFileSync(path.join(__dirname, './mockQuestion.md'), 'utf8');
const config = require('../../config');
const Question = require('../question.model.js');

describe('Question Model', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should be able to publish a question matching the schema', async () => {
    const question = {
      concept: 'Two Way Binding',
      content: 'Introduction to Two Way Binding',
      questionType: 'Multiple Choice Question',
      player: 'mcq-player',
      evaluator: 'mcq-evaluator',
      expectedOutcome: 'Remember',
      question: {
        mdQuestion,
      },
    };

    const publishedQuestion = await Question.publish(question);
    should.exist(publishedQuestion);
    publishedQuestion.should.have.property('id');
    publishedQuestion.should.have.property('createdAt');
    publishedQuestion.should.have.property('updatedAt');
  });

  it('Should not publish a question not matching the schema', async () => {
    const question = {
      concept: 'Two Way Binding',
      question: {
        mdQuestion,
      },
    };

    try {
      const publishedQuestion = await Question.publish(question);
      should.not.exist(publishedQuestion);
    } catch (error) {
      should.exist(error);
      error.should.have.property('errors');
      error.errors.should.have.property('content');
      error.errors.should.have.property('questionType');
      error.errors.should.have.property('player');
      error.errors.should.have.property('evaluator');
      error.errors.should.have.property('expectedOutcome');
    }
  });

  it('Should be able to fetch questions', async () => {
    const publishedQuestions = await Question.fetch();
    should.exist(publishedQuestions);
    publishedQuestions.should.be.a.instanceOf(Array);
    publishedQuestions.length.should.be.exactly(1);
  });

  after(async () => {
    await Question.remove({});
    await mongoose.connection.close();
  });
});
