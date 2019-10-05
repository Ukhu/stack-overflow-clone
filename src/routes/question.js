import express from 'express';
import QuestionController from '../controllers/QuestionControllers';
import middlewares from '../middlewares';

const question = express.Router();
const QUESTION_URL = '/questions';

const { askQuestion } = QuestionController;
const { QuestionValidators: { askQuestionValidators }, verifyToken } = middlewares;

// ask question route
question.post(`${QUESTION_URL}`, verifyToken, askQuestionValidators(), askQuestion);

export default question;
