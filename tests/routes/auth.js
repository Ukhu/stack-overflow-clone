import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src';
import models from '../../src/models';
import mocks from '../__mocks__';

chai.use(chaiHttp);

const { User } = models;
const {
  mockUser: {
    newUser, sameEmailUser, invalidInputUser,
    loginUser, nonExistentEmail, wrongPassword,
    sameDisplayName
  }
} = mocks;

const BASE_URL = '/api/v1/auth';
const SIGNUP_URL = `${BASE_URL}/signup`;
const LOGIN_URL = `${BASE_URL}/login`;

describe('Auth routes', () => {
  describe('Signup POST "/signup"', () => {
    it('should successfully sign a user up', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(newUser)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(201);
          expect(body.message).to.equal('sucessfully created user!');
          expect(body.data).to.be.an('object');
          expect(body.data.displayName).to.equal(newUser.displayName);
          done();
        });
    });

    it('should not accept an already existent email', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(sameEmailUser)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(409);
          expect(body.error).to.equal('email already exists');
          done();
        });
    });

    it('should not accept an already existent displayName', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(sameDisplayName)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(409);
          expect(body.error).to.equal('displayName already exists');
          done();
        });
    });

    it('should return appropiate errors for invalid input field values', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(invalidInputUser)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error).to.be.an('object');
          expect(body.error.body).to.be.an('object');
          expect(body.error.body.displayName).to.equal('displayName cannot be blank');
          expect(body.error.body.email).to.equal('must be a valid email');
          expect(body.error.body.password).to.equal('password must be at least 8 characters, and maximum 15');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(User, 'findOne');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .post(SIGNUP_URL)
        .send(newUser)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });

  describe('Login POST "/login"', () => {
    it('should successfully log a user in', (done) => {
      chai.request(app)
        .post(LOGIN_URL)
        .send(loginUser)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(200);
          expect(body.message).to.equal('login successful');
          expect(body.data).to.be.an('object');
          expect(body.data.email).to.equal(newUser.email);
          done();
        });
    });

    it('should not accept a non-existent email', (done) => {
      chai.request(app)
        .post(LOGIN_URL)
        .send(nonExistentEmail)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(401);
          expect(body.error).to.equal('email or password is incorrect');
          done();
        });
    });

    it('should not accept a wrong password', (done) => {
      chai.request(app)
        .post(LOGIN_URL)
        .send(wrongPassword)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(401);
          expect(body.error).to.equal('email or password is incorrect');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(User, 'findOne');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .post(LOGIN_URL)
        .send(loginUser)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });
});
