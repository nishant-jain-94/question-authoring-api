const fs = require('fs');
const path = require('path');
const should = require('should');
const mongoose = require('mongoose');

const config = require('../../config');
const Question = require('../question.model');
const QuestionController = require('../question.controller');

const mdQuestion = fs.readFileSync(path.join(__dirname, './mockQuestion.md'), 'utf8');
let publishedQuestion;

describe('Question Controller', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should Publish Question', async () => {
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

    publishedQuestion = await QuestionController.publish(question);
    should.exist(publishedQuestion);
    publishedQuestion.should.have.property('id');
    publishedQuestion.should.have.property('player');
    publishedQuestion.should.have.property('concept');
    publishedQuestion.should.have.property('content');
    publishedQuestion.should.have.property('question');
    publishedQuestion.should.have.property('evaluator');
    publishedQuestion.should.have.property('createdAt');
    publishedQuestion.should.have.property('updatedAt');
    publishedQuestion.should.have.property('questionType');
    publishedQuestion.should.have.property('expectedOutcome');
  });

  it('Should be able to fetch questions', async () => {
    const publishedQuestions = await QuestionController.fetch();
    should.exist(publishedQuestions);
    publishedQuestions.should.be.a.instanceOf(Array);
    publishedQuestions.length.should.be.exactly(1);
  });

  it('Should be able to fetch question using concept', async () => {
    const publishedQuestions = await QuestionController.fetch({ concept: 'Two Way Binding' });
    should.exist(publishedQuestions);
    publishedQuestions.should.be.instanceOf(Array);
    publishedQuestions.length.should.be.exactly(1);
    publishedQuestions[0].should.be.an.instanceOf(Object);
    publishedQuestions[0].concept.should.be.exactly('Two Way Binding');
  });

  it('Should be able to fetch question using content', async () => {
    const publishedQuestions = await QuestionController
      .fetch({ content: 'Introduction to Two Way Binding' });
    should.exist(publishedQuestions);
    publishedQuestions.should.be.instanceOf(Array);
    publishedQuestions.length.should.be.exactly(1);
    publishedQuestions[0].should.be.an.instanceOf(Object);
    publishedQuestions[0].content.should.be.exactly('Introduction to Two Way Binding');
  });

  it('Should be able to update and publish a question', async () => {
    publishedQuestion.concept = 'Two Way Binding in AngularJS';
    const updatedQuestion = await QuestionController.publish(publishedQuestion);
    should.exist(updatedQuestion);
    updatedQuestion.should.have.property('id');
  });

  after(async () => {
    await Question.remove({});
    await mongoose.connection.close();
  });
});
