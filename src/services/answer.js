import models from '../models';

const { Answer } = models;

/**
 * Creates an answer in the database
 * @param {string} ownerId
 * @param {string} body
 * @returns {object} an answer object
 */
const createAnswer = async (ownerId, body) => {
  const newAnswer = await Answer.create({
    owner: ownerId,
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
  const answers = await Answer.find({ body: new RegExp(query, 'i') });
  return answers;
};

export default {
  createAnswer,
  searchAnswers
};
