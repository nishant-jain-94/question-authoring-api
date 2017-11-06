const History = require('./history.model');
const jdr = require('json-diff-rfc6902');

// Calculates the differences between the oldQuestion and the newQuestion
const calculateDiffs = (oldQuestion, newQuestion) => {
  try {
    const diffs = jdr.diff(oldQuestion, newQuestion);
    return diffs;
  } catch (error) {
    throw Error(error);
  }
};

// Stores the differences between the Old and the New Question in History Collection
const storeDiffs = async (changeSet) => {
  try {
    const storedChangeSet = await History.insert(changeSet);
    return storedChangeSet;
  } catch (error) {
    throw Error(error);
  }
};

const calculateAndStoreDiffs = async (oldQuestion, newQuestion) => {
  try {
    const diffs = calculateDiffs(oldQuestion, newQuestion);
    const changeSet = {
      questionId: newQuestion.id,
      changes: diffs,
    };
    const savedChangeSet = await storeDiffs(changeSet);
    return savedChangeSet;
  } catch (error) {
    throw Error(error);
  }
};

// Fetches changeSet of a given questionId
const fetchChanges = async (questionId) => {
  try {
    const fetchedQuestion = await History.fetch(questionId);
    return fetchedQuestion;
  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  storeDiffs,
  fetchChanges,
  calculateDiffs,
  calculateAndStoreDiffs,
};
