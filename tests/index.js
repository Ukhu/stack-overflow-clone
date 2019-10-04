import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src';

chai.use(chaiHttp);

describe('Base route GET "/"', () => {
  it('should respond with a welcome message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Welcome to StackOverflow clone');
        done();
      });
  });

  it('should return a 404 error for non-exitent routes', (done) => {
    chai.request(app)
      .get('/non-existent')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('This route does not exist, kindly visit the root route at "/"');
        done();
      });
  });
});
