const should = require('should');

const config = require('../config');

describe('Config', async () => {
  it('Should have all the necessary properties', async () => {
    should.exist(config);
    config.should.have.property('PORT');
    config.should.have.property('MONGODB_URL');
  });
});
