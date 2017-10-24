const mongoose = require('mongoose');
const request = require('supertest');
const config = require('../../config');

const app = require('../../app');

describe('Question Router', () => {
  before(() => {
    mongoose.connect(config.MONGODB_URL);
  });

  it('Should GET an initialized question', (done) => {
    request(app)
      .get('/question/initialize/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.property('id');
        res.body.id.should.be.an.instanceOf(String);
        res.body.should.have.property('question');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        done();
      });
  });

  after(async() => {
    await mongoose.connection.close();
  });
});