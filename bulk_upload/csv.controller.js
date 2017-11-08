const fs = require('fs');
const _ = require('lodash');
const csv = require('fast-csv');

const questionController = require('../question/question.controller');
const config = require('../config');

const mandatoryFields = [
  'concept',
  'content',
  'expectedOutcome',
  'questionType',
  'player',
  'evaluator',
];

const promises = [];

const returnPromiseAfterPublish = assessmentItem =>
  new Promise(async (resolve) => {
    let value;
    try {
      value = await questionController.publish(assessmentItem);
    } catch (error) {
      value = error;
    } finally {
      resolve(value);
    }
  });

const readAndPublish = async () => {
  const stream = fs.createReadStream(config.fileUploadPath);
  csv
    .fromStream(stream, { objectMode: true, headers: true })
    .on('data', (data) => {
      const assessmentItem = _.pick(data, mandatoryFields);
      assessmentItem.question = _.omit(data, mandatoryFields);
      promises.push(returnPromiseAfterPublish(assessmentItem));
    })
    .on('end', () => {
      Promise.all(promises)
        .then((values) => {
          const newValues = values.map((value, index) => {
            if (Object.keys(value).length === 0) {
              return `${value} in line ${index + 2} in the csv`;
            }
            return `Line ${index + 2} was inserted`;
          });
          console.log(newValues);
          fs.unlink(config.fileUploadPath, () => {
            console.log('File has been deleted');
          });
        });
    });
};

module.exports = {
  readAndPublish,
};
