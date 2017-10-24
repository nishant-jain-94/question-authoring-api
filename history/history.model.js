const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  questionId: String,
  changes: [],
}, { minimize: false, timestamps: true });

historySchema.set('toJSON', { getters: true });

// Inserts the ChangeSet in the History Collection
historySchema.statics.insert = async function(changeSet) {
  const change = new this();
  Object.assign(change, changeSet);
  const savedChangeSet = await change.save();
  return savedChangeSet.toJSON();
};

// Fetches the ChangeSet for a questionId
historySchema.statics.fetch = async function(questionId) {
  const changeSets = await this.find({ questionId }).exec();
  const transformedChangeSets = changeSets.map((changeSet) => {
    return changeSet.toJSON();
  });
  return transformedChangeSets;
};

module.exports = mongoose.model('History', historySchema, 'history');
