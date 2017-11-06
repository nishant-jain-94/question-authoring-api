const questionController = require('../question/question.controller');
const config = require('../config');
const fs = require('fs');
const csv = require('fast-csv');
const _ = require('lodash');

const readAndPublish = async () => {
  const stream = fs.createReadStream(config.fileUploadPath);
  let publishedQuestion = '';
  await csv
    .fromStream(stream, { objectMode: true, headers: true })
    .validate(data =>
      data.concept && data.content && data.expectedOutcome && data.player && data.evaluator)
    .on('data-invalid', () => {
      console.log('Error: Primary fields  are missing!!!');
    })
    .on('data', async (data) => {
      let assessmentItem = data;
      let primaryObject = {};
      primaryObject = _.pick(assessmentItem, ['concept', 'content', 'expectedOutcome', 'player', 'evaluator']);
      _.forOwnRight(assessmentItem, (value, key) => {
        if (key === 'concept' || key === 'content' || key === 'expectedOutcome' || key === 'player' || key === 'evaluator') {
          _.unset(assessmentItem, key);
        }
      });
      const secondaryObject = assessmentItem;
      primaryObject.question = secondaryObject;
      assessmentItem = primaryObject;
      const initialisedQuestion = await questionController.initQuestion();
      assessmentItem.id = initialisedQuestion.id;
      publishedQuestion = await questionController.publishQuestion(assessmentItem);
      return publishedQuestion;
    })
    .on('error', (err) => {
      console.log(`Error is ${err}`);
    });
};

module.exports = {
  readAndPublish,
};

