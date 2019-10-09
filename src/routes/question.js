import express from 'express';
import QuestionController from '../controllers/QuestionControllers';
import middlewares from '../middlewares';

const question = express.Router();
const QUESTION_URL = '/questions';

const {
  askQuestion, viewQuestions, voteQuestion, viewSingleQuestion
} = QuestionController;
const {
  QuestionValidators: {
    askQuestionValidators, viewQuestionsValidators, voteQuestionValidators, singleQuestionValidators
  },
  verifyToken
} = middlewares;

// ask question route
question.post(`${QUESTION_URL}`, verifyToken, askQuestionValidators(), askQuestion);

// view questions route
question.get(`${QUESTION_URL}`, verifyToken, viewQuestionsValidators(), viewQuestions);

// view a single question
question.get(`${QUESTION_URL}/:questionId`, verifyToken, singleQuestionValidators(), viewSingleQuestion);

// upvote or downvote a question
question.patch(`${QUESTION_URL}/:questionId/vote`, verifyToken, voteQuestionValidators(), voteQuestion);

export default question;
