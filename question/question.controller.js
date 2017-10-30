// Refers to the Question Collection containing the published question
const Question = require('./question.model');
const historyController = require('../history/history.controller');


// Initialize an empty question in a Question and History collection
const initQuestion = async () => {
  const initializedQuestion = await Question.initialize();
  return initializedQuestion;
};

// Calculates the diffs and publishes the latest question in the Question Collection
const publishQuestion = async (newQuestion) => {
  const oldQuestion = await Question.fetch(newQuestion.id);
  const diffs = await historyController.calculateDiffs(oldQuestion, newQuestion);
  await historyController.storeDiffs({ questionId: newQuestion.id, changes: diffs });
  const publishedQuestion = await Question.patch(newQuestion);
  return publishedQuestion;
};

// Given a questionId fetches question from the Question Collection
const fetchQuestion = async (questionId) => {
  const fetchedQuestion = await Question.fetch(questionId);
  return fetchedQuestion;
};

const fetchAllQuestions = async () => {
  const fetchedQuestions = await Question.fetchAll();
  return fetchedQuestions;
};

module.exports = {
  initQuestion,
  publishQuestion,
  fetchQuestion,
  fetchAllQuestions,
};
