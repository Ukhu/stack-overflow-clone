import express from 'express';
import AnswerController from '../controllers/AnswerControllers';
import middlewares from '../middlewares';

const answer = express.Router();
const ANSWER_URL = '/questions/:questionId/answers';

const { answerQuestion } = AnswerController;
const { AnswerValidators: { answerQuestionValidators }, verifyToken } = middlewares;

// ask question route
answer.post(`${ANSWER_URL}`, verifyToken, answerQuestionValidators(), answerQuestion);

export default answer;
