const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outcomes = {
  values: ['Remember', 'Comprehend', 'Apply', 'Analyze', 'Synthesize', 'Evaluate'],
  message: 'Outcomes validator failed for the path `{PATH}` and value `{VALUE}`',
};

const questionSchema = new Schema({
  concept: String,
  content: String,
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
  player: String,
  evaluator: String,
  expectedOutcome: {
    type: String,
    enum: outcomes,
  },
  question: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { minimize: false, timestamps: true });

questionSchema.set('toJSON', { getters: true });

questionSchema.statics.init = async function(cb) {
  const question = new this();
  const initializedQuestion = await question.save();
  return initializedQuestion.toJSON();
};

questionSchema.statics.patch = async function(question, cb) {
  const query = { _id: question._id };
  const patchedQuestion = await this.findOneAndUpdate(query, question, { upsert: true, new: true }).exec();
  return patchedQuestion.toJSON();
};

questionSchema.statics.fetch = async function(questionId, cb) {
  const query = { _id: questionId };
  const fetchedQuestion = await this.findOne(query).exec();
  return fetchedQuestion.toJSON();
};

questionSchema.statics.fetchAll = async function(cb) {
  return await this.find({}).exec();
};

module.exports = mongoose.model('Question', questionSchema, 'question');
