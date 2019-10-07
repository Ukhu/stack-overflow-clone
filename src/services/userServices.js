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
  const foundUser = await User.find({
    displayName: new RegExp(query, 'i')
  });
  return foundUser;
};

export default {
  findUser,
  searchUsers,
  createUser
};
