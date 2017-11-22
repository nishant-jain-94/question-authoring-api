const fs = require('fs');
const _ = require('lodash');
const csv = require('fast-csv');

const CSVStatus = require('./csv.model');
const questionController = require('../question/question.controller');

const mandatoryFields = [
  'concept',
  'content',
  'expectedOutcome',
  'questionType',
  'player',
  'evaluator',
];

const statusObject = {};

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

const readAndPublish = (file) => {
  const stream = fs.createReadStream(file.path);
  csv
    .fromStream(stream, { objectMode: true, headers: true })
    .on('data', (data) => {
      const assessmentItem = _.pick(data, mandatoryFields);
      assessmentItem.question = _.omit(data, mandatoryFields);
      promises.push(returnPromiseAfterPublish(assessmentItem));
    })
    .on('end', () => {
      statusObject.fileName = file.originalname;
      statusObject.errorMessages = [];
      Promise.all(promises)
        .then((values) => {
          values.map((value, index) => {
            if (Object.keys(value).length === 0) {
              statusObject.errorMessages.push(`${value} in line ${index + 2} in the csv`);
              return `${value} in line ${index + 2} in the csv`;
            }
            return `Line ${index + 2} was inserted`;
          });
          CSVStatus.saveStatus(statusObject);
          fs.unlink(file.path, () => {
            // console.log('File has been deleted');
          });
        });
    });
};

const fetchAllStatuses = async (query, limit, page) => {
  try {
    const statuses = await CSVStatus.fetch(query, limit, page);
    return statuses;
  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  readAndPublish,
  fetchAllStatuses,
};
