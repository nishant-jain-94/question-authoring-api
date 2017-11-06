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
  try {
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
  } catch (error) {
    throw error;
  }
};

DraftSchema.statics.fetch = async function fetchAll(query = {}, page = 1, limit = 100) {
  try {
    const skips = limit * (page - 1);
    const questions = await this.find(query).skip(skips).limit(limit).exec();
    return questions;
  } catch (error) {
    throw error;
  }
};

DraftSchema.statics.deleteDrafts = async function deleteDrafts(draftIds) {
  try {
    const draftedQuestions = await this.deleteMany({ _id: { $in: draftIds } });
    return draftedQuestions;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Draft', DraftSchema, 'draft');
