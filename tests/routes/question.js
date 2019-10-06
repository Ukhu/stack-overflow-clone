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
    newQuestion2,
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

    it('should successfully post a question without a tag', (done) => {
      chai.request(app)
        .post(QUESTION_URL)
        .set('authorization', userToken)
        .send(newQuestion2)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(201);
          expect(body.message).to.equal('successfully asked a question!');
          expect(body.data).to.be.an('object');
          expect(body.data.title).to.equal(newQuestion2.title);
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

  describe('View Question GET "/questions"', () => {
    it('should successfully return questions', (done) => {
      chai.request(app)
        .get(QUESTION_URL)
        .query({ page: 1, limit: 10 })
        .set('authorization', userToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'currentPage', 'totalPages', 'limit', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('succesfully returned questions');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should return an error response if the page and limit provided are not integers', (done) => {
      chai.request(app)
        .get(QUESTION_URL)
        .query({ page: 'abc', limit: 'xyz' })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error.query).to.be.an('object');
          expect(body.error.query).to.have.keys(['page', 'limit']);
          expect(body.error.query.page).to.equal('page must be a number');
          expect(body.error.query.limit).to.equal('limit must be a number');
          done();
        });
    });

    it('should return an error response if the page and limit provided are empty', (done) => {
      chai.request(app)
        .get(QUESTION_URL)
        .query({ page: '', limit: '' })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(400);
          expect(body.error.query).to.be.an('object');
          expect(body.error.query).to.have.keys(['page', 'limit']);
          expect(body.error.query.page).to.equal('page cannot be blank');
          expect(body.error.query.limit).to.equal('limit cannot be blank');
          done();
        });
    });

    it('should return an appropiate message if the count of questions in the database is less than 1', (done) => {
      const stub = sinon.stub(Question, 'countDocuments');
      stub.returns(0);
      chai.request(app)
        .get(QUESTION_URL)
        .query({ page: 1, limit: 10 })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(404);
          expect(body).to.have.keys(['message', 'data']);
          expect(body.message).to.be.a('string');
          expect(body.data.length).to.equal(0);
          expect(body.message).to.equal('no questions found');
          stub.restore();
          done();
        });
    });

    it('should return an error message if the page number supplied is more than the available pages', (done) => {
      chai.request(app)
        .get(QUESTION_URL)
        .query({ page: 1000, limit: 10 })
        .set('authorization', userToken)
        .end((error, response) => {
          const { status, body } = response;
          expect(status).to.equal(404);
          expect(body.error).to.equal('page not found');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Question, 'countDocuments');
      stub.throws(new Error('error occured!'));
      chai.request(app)
        .get(QUESTION_URL)
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
