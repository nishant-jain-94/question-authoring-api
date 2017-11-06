/**
 * A controller handling operations related to publishing/published questions.
*/

const Question = require('./question.model');
const History = require('../history/history.controller');

const fetch = async (query, limit, page) => {
  const questions = await Question.fetch(query, limit, page);
  return questions;
};

const publish = async (question) => {
  try {
    const fetchedQuestions = await Question.fetch({ _id: question.id });
    const oldQuestion = fetchedQuestions.length ? fetchedQuestions[0] : {};
    const publishedQuestion = await Question.publish(question);
    await History.calculateAndStoreDiffs(oldQuestion, publishedQuestion);
    return publishedQuestion;
  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  publish,
  fetch,
};
