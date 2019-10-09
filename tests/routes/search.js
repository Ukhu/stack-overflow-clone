import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src';
import models from '../../src/models';
import mocks from '../__mocks__';

chai.use(chaiHttp);

const { Question } = models;
const {
  mockQuestion: { demoQuestion2 },
  mockAnswer: { demoAnswer },
  mockUser: { demoUser3 }
} = mocks;

const BASE_URL = '/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const QUESTION_URL = `${BASE_URL}/questions`;
const SEARCH_URL = `${BASE_URL}/search`;

let ANSWER_URL;
let userToken;

describe('Search routes', () => {
  before((done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(demoUser3)
      .end((error, response) => {
        userToken = response.body.data.token;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post(QUESTION_URL)
      .set('authorization', userToken)
      .send(demoQuestion2)
      .end((error, response) => {
        const questionId = response.body.data._id;
        ANSWER_URL = `${QUESTION_URL}/${questionId}/answers`;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post(ANSWER_URL)
      .set('authorization', userToken)
      .send(demoAnswer)
      .end(() => {
        done();
      });
  });

  describe('Search Questions, Answers, or Users GET "/search"', () => {
    it('should successfully search for questions', (done) => {
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'questions', value: 'python' })
        .set('authorization', userToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned questions');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should successfully search for answers', (done) => {
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'answers', value: 'javascript' })
        .set('authorization', userToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned answers');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should successfully search for users', (done) => {
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'users', value: 'matt' })
        .set('authorization', userToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned users');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should return an appropiate message if there are no resources based on the query', (done) => {
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'questions', value: 'dsnjdbfsdhkfjsn' })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(404);
          expect(body).to.have.keys(['message', 'data']);
          expect(body.message).to.be.a('string');
          expect(body.data.length).to.equal(0);
          expect(body.message).to.equal('no questions found');
          done();
        });
    });

    it('should return an error response if the search type or value are invalid', (done) => {
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'sgsbfhufe', value: '' })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error.query).to.be.an('object');
          expect(body.error.query).to.have.keys(['type', 'value']);
          expect(body.error.query.type).to.equal('search type must be either questions, answers or users');
          expect(body.error.query.value).to.equal('value cannot be blank');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Question, 'find');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .get(SEARCH_URL)
        .query({ type: 'questions', value: 'dsnjdbfsdhkfjsn' })
        .set('authorization', userToken)
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
