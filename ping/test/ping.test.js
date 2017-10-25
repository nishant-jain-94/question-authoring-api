const should = require('should');
const app = require('../../app');
const request = require('supertest');

describe('Ping', () => {
  it('Should reply with Pong', (done) => {
    request(app)
      .get('/ping')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.text.should.be.exactly('pong');
        done();
      });
  });
});
