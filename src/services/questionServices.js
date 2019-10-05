import models from '../models';

const { Question } = models;

/**
 * Adds a new user to the database
 * @param {string} param
 * @returns {object} a user object
 */

const createQuestion = async (id, title, body, tags) => {
  const newQuestion = await Question.create({
    owner: id,
    title,
    body,
    tags: tags ? [...tags] : []
  });
  return newQuestion;
};

export default {
  createQuestion
};
