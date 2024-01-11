import * as chai from 'chai';
const chaiHttp = import('chai-http');

chaiHttp.then(({default: chaiHttpDefault}) => {
  chai.use(chaiHttpDefault);
  const { expect } = chai;

  describe('Server', () => {
    it('it should GET /', (done) => {
      chai.request('http://localhost:3000')
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
