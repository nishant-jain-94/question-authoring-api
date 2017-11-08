const mongoose = require('mongoose');

const { Schema } = mongoose;

const outcomes = {
  values: ['Remember', 'Comprehend', 'Apply', 'Analyze', 'Synthesize', 'Evaluate'],
  message: 'Outcomes validator failed for the path `{PATH}` and value `{VALUE}`',
};

const questionSchema = new Schema({
  concept: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: 'No Subject',
  },
  content: {
    type: String,
    required: true,
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
    required: true,
  },
  player: {
    type: String,
    required: true,
  },
  evaluator: {
    type: String,
    required: true,
  },
  expectedOutcome: {
    type: String,
    enum: outcomes,
    required: true,
  },
  question: {
    type: Schema.Types.Mixed,
    required: true,
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, { minimize: false, timestamps: true });

questionSchema.set('toJSON', { getters: true, hide: '_id' });

/**
 * TL;DR
 * Creates or Updates a question.
 * ------------------------------------------------------------------------------------------------
 * Given a `question`, the publish method looks for an existing
 * question. If the question already exists then the `existingQuestion`
 * is updated with the `question` which was inputted forming the `current`
 * question. Else the a new instance of the question is created and is
 * updated with the `question` which was inputted forming the current
 * of the question. The `current` question is then updated in the database.
 *
 * @param {any} question
 * @returns {Object} publishedQuestion
 */
questionSchema.statics.publish = async function publish(question) {
  try {
    const [existingQuestion] = question.id ?
      await this.find({ _id: question.id }).exec() :
      [new this()];
    Object.assign(existingQuestion, question);
    const publishedQuestion = await existingQuestion.save();
    return publishedQuestion.toJSON();
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches all published question from the question collection.
 * By default it fetches 100 question without any specific criteria.
 * The criteria can be overidden by the `query` parameter.
 * Number of questions per page can be controlled by the `limit` and the `page` parameters.
 *
 * @param {any} [query={}]     Criteria by which the results are to be feched.
 * @param {number} [limit=100] Limits the number of results to hundred.
 * @param {number} [page=1]    A parameter to page results.
 * @returns {Array<Question>}  An array of published question matching the query.
 */
questionSchema.statics.fetch = async function fetch(query = {}, limit = 100, page = 1) {
  try {
    const skips = limit * (page - 1);
    const fetchedQuestions = await this.find(query).skip(skips).limit(limit).exec();
    return fetchedQuestions.map(question => question.toJSON());
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Question', questionSchema, 'question');
