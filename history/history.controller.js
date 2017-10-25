// Refers to the Collection containing the Changeset for every question
const History = require('./history.model');
const jdr = require('json-diff-rfc6902');

// Calculates the differences between the oldQuestion and the newQuestion
const calculateDiffs = (oldQuestion, newQuestion) => {
  const diffs = jdr.diff(oldQuestion, newQuestion);
  return diffs;
};

// Stores the differences between the Old and the New Question in History Collection
const storeDiffs = async (changeSet) => {
  const history = new History();
  Object.assign(history, changeSet);
  const storedChangeSet = await History.insert(changeSet);
  return storedChangeSet;
};

// Fetches changeSet of a given questionId
const fetchQuestion = async (questionId) => {
  const fetchedQuestion = await History.fetch(questionId);
  return fetchedQuestion;
};

module.exports = {
  calculateDiffs,
  storeDiffs,
  fetchQuestion,
};
