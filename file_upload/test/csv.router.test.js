const path = require('path');
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');

const Question = require('../../question/question.model');

const config = require('../../config');
const app = require('../../app');

const filePath = path.join(__dirname, 'assessmentItem.csv');

describe('CSV Router', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URL);
  });

  it('Should accept a file with field name as myField', (done) => {
    request(app)
      .post('/fileUpload')
      .attach('myFile', filePath)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.message.should.not.be.null();
        done();
      });
  });

  after(async () => {
    await Question.remove({});
    await mongoose.connection.close();
  });
});

