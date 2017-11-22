const mongoose = require('mongoose');

const { Schema } = mongoose;

const csvStatusSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },

  errorMessages: {
    type: Array,
    default: [],
  },

  userId: {
    type: String,
    default: '232832K80',
  },
}, { timestamps: true });

csvStatusSchema.set('toJSON', { getters: true, hide: '_id' });

csvStatusSchema.statics.saveStatus = async function save(statusObject) {
  const statusData = new this(statusObject);
  try {
    const savedStatus = await statusData.save();
    return savedStatus.toJSON();
  } catch (error) {
    throw error;
  }
};

csvStatusSchema.statics.fetch = async function fetch(query = {}, limit = 100, page = 1) {
  try {
    const skips = limit * (page - 1);
    const fetchedStatuses = await this.find(query).skip(skips).limit(limit).exec();
    return fetchedStatuses.map(status => status.toJSON());
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('CSVStatus', csvStatusSchema, 'csvstatus');
