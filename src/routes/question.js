import express from 'express';
import QuestionController from '../controllers/QuestionControllers';
import middlewares from '../middlewares';

const question = express.Router();
const QUESTION_URL = '/questions';

const { askQuestion, viewQuestions } = QuestionController;
const {
  QuestionValidators: { askQuestionValidators, viewQuestionsValidators },
  verifyToken
} = middlewares;

// ask question route
question.post(`${QUESTION_URL}`, verifyToken, askQuestionValidators(), askQuestion);

// view questions route
question.get(`${QUESTION_URL}`, verifyToken, viewQuestionsValidators(), viewQuestions);

export default question;
