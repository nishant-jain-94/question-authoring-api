const mongoose = require('mongoose');

const { Schema } = mongoose;

const outcomes = {
  values: [
    'Remember',
    'Comprehend',
    'Apply',
    'Analyze',
    'Synthesize',
    'Evaluate',
  ],
  message: 'Outcomes validator failed for the path `{PATH}` and value `{VALUE}`',
};

const DraftSchema = new Schema({
  subject: {
    type: String,
    default: 'No Subject',
  },
  concept: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    name: {
      type: String,
      default: 'Anonymous',
    },
    userId: {
      type: String,
      default: 'Anonymous',
    },
  },
  questionType: {
    type: String,
  },
  player: {
    type: String,
  },
  evaluator: {
    type: String,
  },
  expectedOutcome: {
    type: String,
    enum: outcomes,
  },
  question: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { minimize: false, timestamps: true });

DraftSchema.set('toJSON', { getters: true });

DraftSchema.statics.draft = async function patch(question) {
  const query = { _id: question.id ? question.id : mongoose.Types.ObjectId() };
  const queryOptions = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    runSettersOnQuery: true,
  };

  const patchedQuestion = await this.findOneAndUpdate(
    query,
    question,
    queryOptions,
  ).exec();

  return patchedQuestion.toJSON();
};

DraftSchema.statics.fetch = async function fetchAll(query = {}, page = 1, limit = 100) {
  const skips = limit * (page - 1);
  const questions = await this.find(query).skip(skips).limit(limit).exec();
  return questions;
};

DraftSchema.statics.deleteDrafts = async function deleteDrafts(draftIds) {
  const draftedQuestions = await this.deleteMany({ _id: { $in: draftIds } });
  return draftedQuestions;
};

module.exports = mongoose.model('Draft', DraftSchema, 'draft');
