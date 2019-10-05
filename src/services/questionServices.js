import models from '../models';

const { Question } = models;

/**
 * Creates a new question in the database
 * @param {string} id
 * @param {string} title
 * @param {string} body
 * @param {string} tags
 * @returns {object} a question object
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

/**
 * Finds a question in the database
 * @param {string} id
 * @returns {object} a question object
 */
const findQuestion = async (id) => {
  const foundQuestion = await Question.findById(id);
  return foundQuestion;
};

/**
 * Updates a question with an answer
 * @param {string} id
 * @param {string} answerId
 * @returns {undefined}
 */
const addAnswerToQuestion = async (id, answerId) => {
  await Question.findByIdAndUpdate(id, {
    $push: {
      answers: answerId
    }
  }, {
    useFindAndModify: false
  });
};

export default {
  findQuestion,
  createQuestion,
  addAnswerToQuestion
};
