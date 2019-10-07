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

/**
 * Searches for an answer in the database
 * @param {string} query
 * @returns {object} an answers object
 */
const searchAnswers = async (query) => {
  const answers = await Answer.find({
    $or: [
      { body: new RegExp(query, 'i') },
    ]
  });
  return answers;
};

export default {
  createAnswer,
  searchAnswers
};
