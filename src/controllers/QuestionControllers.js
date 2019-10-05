import helpers from '../helpers';
import services from '../services';

const { responseMessage } = helpers;
const { questionServices: { createQuestion } } = services;

/**
 * @class QuestionControllers
 * @classdesc related controllers that perform operations on the Question model
 */
export default class QuestionControllers {
  /**
   * @method askQuestion
   * @description creates a new question in the database
   * @param {object} request
   * @param {object} response
   * @returns {json} object
   */
  static async askQuestion(request, response) {
    const { title, body, tags } = request.body;
    const { id } = request.user;
    try {
      const newQuestion = await createQuestion(id, title, body, tags);
      responseMessage(response, 201, {
        message: 'successfully asked a question!',
        data: newQuestion
      });
    } catch (error) {
      responseMessage(response, 500, {
        error: error.message
      });
    }
  }
}
