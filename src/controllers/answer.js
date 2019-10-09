import helpers from '../helpers';
import services from '../services';

const { responseMessage } = helpers;
const {
  answerServices: { createAnswer },
  questionServices: { findQuestion, addAnswerToQuestion }
} = services;

/**
 * @method answerQuestion
 * @description creates an answer in the database
 * @param {object} request
 * @param {object} response
 * @returns {json} object
 */
export default async (request, response) => {
  const { body } = request.body;
  const { id } = request.user;
  const { questionId } = request.params;
  try {
    const question = await findQuestion(questionId);
    if (!question) return responseMessage(response, 404, { error: 'question not found!' });
    const newAnswer = await createAnswer(id, body);
    await addAnswerToQuestion(questionId, newAnswer.id);
    responseMessage(response, 201, {
      message: 'successfully answered a question!',
      data: newAnswer
    });
  } catch (error) {
    responseMessage(response, 500, {
      error: error.message
    });
  }
};
