// Refers to the Question Collection containing the published question
const Question = require('./question.model');
const historyController = require('../history/history.controller');

// A utility to find the difference between JSON based on rfc6902
const jdr = require('json-diff-rfc6902');

// Initialize an empty question in a Question and History collection
const initQuestion = async() => {
  const initializedQuestion = await Question.init();
  return initializedQuestion;
};

// Calculates the diffs and publishes the latest question in the Question Collection 
const publishQuestion = async(newQuestion) => {
  const oldQuestion = await Question.fetch(newQuestion.id);
  const diffs = await historyController.calculateDiffs(oldQuestion, newQuestion);
  await historyController.storeDiffs(diffs);
  return await Question.patch(newQuestion);
};

// Given a questionId fetches question from the Question Collection
const fetchQuestion = async(questionId) => {
  return await Question.fetch(questionId);
};

const fetchAllQuestions = async() => {
  return await Question.fetchAll();
};

module.exports = {
  initQuestion,
  publishQuestion,
  fetchQuestion
};
