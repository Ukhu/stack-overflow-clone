import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src';
import models from '../../src/models';
import mocks from '../__mocks__';

chai.use(chaiHttp);

const { User, Question } = models;
const {
  mockQuestion: {
    newQuestion,
    shortTitleAndBody,
    nonArrayTags
  },
  mockUser: { demoUser }
} = mocks;

const BASE_URL = '/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const QUESTION_URL = `${BASE_URL}/questions`;


let userToken;

describe('Question routes', () => {
  before((done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(demoUser)
      .end((error, response) => {
        userToken = response.body.data.token;
        done();
      });
  });

  describe('Ask Question POST "/questions"', () => {
    it('should successfully post a question', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(newQuestion)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(201);
          expect(body.message).to.equal('successfully asked a question!');
          expect(body.data).to.be.an('object');
          expect(body.data.title).to.equal(newQuestion.title);
          done();
        });
    });

    it('should return a bad request error for invalid title and body', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(shortTitleAndBody)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error).to.be.an('object');
          expect(body.error.body).to.be.an('object');
          expect(body.error.body.title).to.equal('title must be between 3 to 100 characters');
          expect(body.error.body.body).to.equal('body must be between 3 to 1024 characters');
          done();
        });
    });

    it('should return a bad request error for invalid tags', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(nonArrayTags)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error).to.be.an('object');
          expect(body.error.body).to.be.an('object');
          expect(body.error.body.tags).to.equal('tags must be grouped in an array');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Question, 'create');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(newQuestion)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });

    it('should return an unauthorized error if no token is provided', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .send(newQuestion)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(401);
          expect(body.error).to.equal('no token provided');
          done();
        });
    });

    it('should return an unauthorized error if the token is invalid', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', 'invalidtoken')
        .send(newQuestion)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(401);
          expect(body.error).to.equal('invalid token');
          done();
        });
    });

    it('should return a failure response if a server error occurs in the verifyToken middleware', (done) => {
      const stub = sinon.stub(User, 'findOne');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(newQuestion)
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
