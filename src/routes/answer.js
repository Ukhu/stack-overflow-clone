import express from 'express';
import answerQuestion from '../controllers/answer';
import middlewares from '../middlewares';

const answer = express.Router();
const ANSWER_URL = '/questions/:questionId/answers';

const { AnswerValidators, verifyToken } = middlewares;

// answer question route
answer.post(`${ANSWER_URL}`, verifyToken, AnswerValidators(), answerQuestion);

export default answer;
