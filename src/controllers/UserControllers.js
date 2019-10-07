import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import services from '../services';
import helpers from '../helpers';

const {
  userServices: {
    findUser, createUser, searchUsers
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
 * @class UserControllers
 * @classdesc related controllers that perform operations on the User model
 */
export default class UserControllers {
  /**
   * @method signup
   * @description creates a new User in the database
   * @param {object} request
   * @param {object} response
   * @returns {json} of user object
   */
  static async signup(request, response) {
    const { displayName, email, password } = request.body;
    try {
      const existingEmail = await findUser(email);
      if (existingEmail) return responseMessage(response, 409, { error: 'email already exists' });
      const existingDisplayName = await findUser(displayName);
      if (existingDisplayName) return responseMessage(response, 409, { error: 'displayName already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser({
        displayName, email, password: hashedPassword
      });
      const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      responseMessage(response, 201, {
        message: 'sucessfully created user!',
        data: {
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.displayName,
          token
        }
      });
    } catch (error) {
      responseMessage(response, 500, {
        error: error.message
      });
    }
  }

  /**
   * @method login
   * @description logs an existing user
   * @param {object} request
   * @param {object} response
   * @returns {json} user object
   */
  static async login(request, response) {
    const { email, password } = request.body;
    try {
      const user = await findUser(email);
      let match;
      if (user) match = await bcrypt.compare(password, user.password);
      if (!user || !match) return responseMessage(response, 401, { error: 'email or password is incorrect' });
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      responseMessage(response, 200, {
        message: 'login successful',
        data: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          token
        }
      });
    } catch (error) {
      responseMessage(response, 500, {
        error: error.message
      });
    }
  }

  /**
   * @method search
   * @description search the database for a question, answer or user
   * @param {object} request
   * @param {object} response
   * @returns {json} of user object
   */
  static async search(request, response) {
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
  }
}
