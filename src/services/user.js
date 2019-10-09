import models from '../models';

const { User } = models;

/**
 * Finds a user from the database by email, id, or displayName
 * @param {string} param
 * @returns {object} a user object
 */
const findUser = async (param) => {
  let user;
  if (/^[a-fA-F0-9]{24}$/g.test(param)) {
    user = await User.findById(param);
  } else {
    user = await User.findOne({
      $or: [
        { email: param },
        { displayName: param }
      ]
    });
  }
  return user;
};

/**
 * checks if a user exists in the database
 * @param {string} email
 * @param {string} displayName
 * @returns {object} if user exists
 */
const checkIfUserExists = async (email, displayName) => {
  const existingEmail = await findUser(email);
  if (existingEmail) return { error: 'email already exists' };
  const existingDisplayName = await findUser(displayName);
  if (existingDisplayName) return { error: 'displayName already exists' };
  return false;
};

/**
 * Adds a new user to the database
 * @param {string} user
 * @returns {object} a user object
 */
const createUser = async (user) => {
  const newUser = await User.create({
    ...user
  });
  return newUser;
};

/**
 * Searches for a user in the database
 * @param {string} query
 * @returns {object} a user object
 */
const searchUsers = async (query) => {
  const foundUser = await User.find({ displayName: new RegExp(query, 'i') });
  return foundUser;
};

export default {
  findUser,
  checkIfUserExists,
  searchUsers,
  createUser
};
