const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL: process.env.MONGODB_URL || 'localhost:29017/assessment_item',
  fileUploadPath: process.env.FILE_UPLOAD_PATH || 'assessmentItem.csv',
};

module.exports = config;
