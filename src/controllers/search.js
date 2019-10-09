import services from '../services';
import helpers from '../helpers';

const {
  userServices: {
    searchUsers
  },
  questionServices: {
    searchQuestions
  },
  answerServices: {
    searchAnswers
  }
} = services;
const { responseMessage } = helpers;

/**
 * @method search
 * @description search the database for a question, answer or user
 * @param {object} request
 * @param {object} response
 * @returns {json} object
 */
export default async (request, response) => {
  const { type, value } = request.query;
  try {
    let results;
    switch (type) {
      case 'questions':
        results = await searchQuestions(value);
        break;
      case 'answers':
        results = await searchAnswers(value);
        break;
      case 'users':
        results = await searchUsers(value);
        break;
      default:
        break;
    }
    if (results.length < 1) {
      return responseMessage(response, 404, { message: `no ${type} found`, data: [] });
    }
    responseMessage(response, 200, {
      message: `successfully returned ${type}`,
      data: results
    });
  } catch (error) {
    responseMessage(response, 500, {
      error: error.message
    });
  }
};
