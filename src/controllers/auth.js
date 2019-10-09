import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import services from '../services';
import helpers from '../helpers';

const {
  userServices: {
    findUser, createUser,
    checkIfUserExists
  }
} = services;
const { responseMessage } = helpers;

/**
 * @method signup
 * @description creates a new User in the database
 * @param {object} request
 * @param {object} response
 * @returns {json} object
 */
export const signup = async (request, response) => {
  const { displayName, email, password } = request.body;
  try {
    const existingUser = await checkIfUserExists(email, displayName);
    if (existingUser) return responseMessage(response, 409, { error: existingUser.error });
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
};

/**
 * @method login
 * @description logs an existing user
 * @param {object} request
 * @param {object} response
 * @returns {json} object
 */
export const login = async (request, response) => {
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
};
