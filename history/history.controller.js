const History = require('./history.model');
const jdr = require('json-diff-rfc6902');

// Calculates the differences between the oldQuestion and the newQuestion
const calculateDiffs = (oldQuestion, newQuestion) => {
  const diffs = jdr.diff(oldQuestion, newQuestion);
  return diffs;
};

// Stores the differences between the Old and the New Question in History Collection
const storeDiffs = async (changeSet) => {
  const storedChangeSet = await History.insert(changeSet);
  return storedChangeSet;
};

const calculateAndStoreDiffs = async (oldQuestion, newQuestion) => {
  const diffs = calculateDiffs(oldQuestion, newQuestion);
  const changeSet = {
    questionId: newQuestion.id,
    changes: diffs,
  };
  const savedChangeSet = await storeDiffs(changeSet);
  return savedChangeSet;
};

// Fetches changeSet of a given questionId
const fetchChanges = async (questionId) => {
  const fetchedQuestion = await History.fetch(questionId);
  return fetchedQuestion;
};

module.exports = {
  storeDiffs,
  fetchChanges,
  calculateDiffs,
  calculateAndStoreDiffs,
};
