import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src';
import models from '../../src/models';
import mocks from '../__mocks__';

chai.use(chaiHttp);

const { Question } = models;
const {
  mockQuestion: { demoQuestion },
  mockUser: { demoUser2 },
  mockAnswer: {
    newAnswer,
    shortAnswer
  }
} = mocks;

const BASE_URL = '/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const QUESTION_URL = `${BASE_URL}/questions`;

let ANSWER_URL;
let userToken;

describe('Answer question route', () => {
  before((done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(demoUser2)
      .end((error, response) => {
        userToken = response.body.data.token;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post(QUESTION_URL)
      .set('authorization', userToken)
      .send(demoQuestion)
      .end((error, response) => {
        const questionId = response.body.data._id;
        ANSWER_URL = `${QUESTION_URL}/${questionId}/answers`;
        done();
      });
  });

  describe('Answer Question POST "/questions/:questionId/answers"', () => {
    it('should successfully answer a question', (done) => {
      chai.request(app)
        .post(ANSWER_URL)
        .set('authorization', userToken)
        .send(newAnswer)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(201);
          expect(body.message).to.equal('successfully answered a question!');
          expect(body.data).to.be.an('object');
          expect(body.data.body).to.equal(newAnswer.body);
          done();
        });
    });

    it('should return a 404 if there is no question with the questionId provided', (done) => {
      chai.request(app)
        .post(`${QUESTION_URL}/5d98f8721234567ea8c261a5/answers`)
        .set('authorization', userToken)
        .send(newAnswer)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(404);
          expect(body.error).to.equal('question not found!');
          done();
        });
    });

    it('should return a bad request error for invalid questionId and answer body', (done) => {
      chai.request(app)
        .post(`${QUESTION_URL}/5d9invalidQuestionIda5/answers`)
        .set('authorization', userToken)
        .send(shortAnswer)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error).to.be.an('object');
          expect(body.error.body).to.be.an('object');
          expect(body.error.body.body).to.equal('body must be between 3 to 1024 characters');
          expect(body.error.params.questionId).to.equal('questionId must be a valid ID');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Question, 'findById');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .post(ANSWER_URL)
        .set('authorization', userToken)
        .send(newAnswer)
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
