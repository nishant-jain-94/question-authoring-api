const mongoose = require('mongoose');

const { Schema } = mongoose;

const historySchema = new Schema({
  questionId: { type: String, required: true },
  changes: [],
}, { minimize: false, timestamps: true });

historySchema.set('toJSON', { getters: true });

// Inserts the ChangeSet in the History Collection
historySchema.statics.insert = async function insertChangeSet(changeSet) {
  const diffs = new this(changeSet);
  const savedChangeSet = await diffs.save();
  return savedChangeSet.toJSON();
};

// Fetches the ChangeSet for a questionId
historySchema.statics.fetch = async function fetchChangeSet(questionId) {
  const changeSets = await this.find({ questionId }).exec();
  const transformedChangeSets = changeSets.map(changeSet => changeSet.toJSON());
  return transformedChangeSets;
};

module.exports = mongoose.model('History', historySchema, 'history');
