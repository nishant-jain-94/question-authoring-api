// Refers to the Collection containing the Changeset for every question
const History = require('./history.model');
const jdr = require('json-diff-rfc6902');

// Calculates the differences between the oldQuestion and the newQuestion
const calculateDiffs = (oldQuestion, newQuestion) => {
  const diffs = jdr.diff(oldQuestion, newQuestion); 
  return diffs;
};

// Stores the differences between the Old and the New Question in History Collection
const storeDiffs = async(changeSet) => {
  const history = new History();
  Object.assign(history, changeSet);
  return await History.insert(changeSet);
};

// Fetches changeSet of a given questionId 
const fetchQuestion = async(questionId) => {
  return await History.fetch(questionId);
}

module.exports = {
  calculateDiffs,
  storeDiffs,
  fetchQuestion
};