import helpers from '../helpers';
import services from '../services';
import models from '../models';

const { Question } = models;
const { responseMessage, extractQuestions } = helpers;
const { questionServices: { createQuestion, findAllQuestions } } = services;

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

  /**
   * @method viewQuestions
   * @description gets all quesitons from the database
   * @param {object} request
   * @param {object} response
   * @returns {json} object
   */
  static async viewQuestions(request, response) {
    const { page = 1, limit = 20 } = request.query;
    try {
      const count = await Question.countDocuments();
      if (!count) {
        return responseMessage(response, 404, { message: 'no questions found', data: [] });
      }
      const pages = Math.ceil(count / limit);
      if (page > pages) {
        return responseMessage(response, 404, { error: 'page not found' });
      }
      const offset = limit * (page - 1);
      const results = await findAllQuestions(offset, Number(limit));
      const questions = extractQuestions(results);
      response.status(200).json({
        message: 'succesfully returned questions',
        currentPage: page,
        totalPages: pages,
        limit,
        data: questions
      });
    } catch (error) {
      responseMessage(response, 500, { error: error.message });
    }
  }
}
