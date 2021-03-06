import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helpers from '../helpers';
import services from '../services';

dotenv.config();

const { SECRET_KEY } = process.env;

const { responseMessage } = helpers;
const { userServices: { findUser } } = services;

/**
 *
 * @param {object} request
 * @param {object} response
 * @param {*} next
 * @returns {*} json or next
 */
export default (request, response, next) => {
  const token = request.headers.authorization;

  if (token) {
    jwt.verify(token, SECRET_KEY, async (error, decoded) => {
      if (error) {
        responseMessage(response, 401, { error: 'invalid token' });
      } else {
        try {
          const user = await findUser(decoded.id);
          if (!user) {
            return responseMessage(response, 404, { error: 'user not found' });
          }
          request.user = user;
          return next();
        } catch (err) {
          responseMessage(response, 500, { error: err.message });
        }
      }
    });
  } else {
    responseMessage(response, 401, { error: 'no token provided' });
  }
};
