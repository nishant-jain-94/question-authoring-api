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

let promises = [];

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
          if (values.length !== 0) {
            values.map((value, index) => {
              if (Object.keys(value).length === 0) {
                statusObject.errorMessages.push(`${value} in line ${index + 2} in the csv`);
                statusObject.status = 'Questions published with some exceptions';
                return `${value} in line ${index + 2} in the csv`;
              }
              statusObject.status = 'All lines were inserted';
              return `Line ${index + 2} was inserted`;
            });
          } else {
            statusObject.status = 'No data in CSV file';
            statusObject.errorMessages.push('No data in CSV file');
          }
          CSVStatus.saveStatus(statusObject);
          promises = [];
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
