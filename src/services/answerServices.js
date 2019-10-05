import models from '../models';

const { Answer } = models;

/**
 * Creates an answer in the database
 * @param {string} param
 * @returns {object} an answer object
 */

const createAnswer = async (id, body) => {
  const newAnswer = await Answer.create({
    owner: id,
    body
  });
  return newAnswer;
};

export default {
  createAnswer
};
