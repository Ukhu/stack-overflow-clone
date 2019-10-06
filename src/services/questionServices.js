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
 * Finds a question a user has voted on
 * @param {string} questionId
 * @param {string} userId
 * @returns {object} a question object
 */
const findVotedQuestion = async (questionId, userId) => {
  const question = await Question.findOne({ _id: questionId, 'votes.voter': userId });
  return question;
};

/**
 * Inserts a new vote by a User into a question
 * @param {string} questionId
 * @param {string} userId
 * @param {string} voteType
 * @returns {object} a question object
 */
const insertVote = async (questionId, userId, voteType) => {
  const vote = await Question.findByIdAndUpdate(questionId, {
    $push: {
      votes: {
        voter: userId,
        voteType
      }
    }
  }, { useFindAndModify: false });
  return vote;
};

/**
 * Updates a users vote
 * @param {string} questionId
 * @param {string} userId
 * @param {string} voteType
 * @returns {null} null
 */
const updateVote = async (questionId, userId, voteType) => {
  await Question.findOneAndUpdate({ _id: questionId, 'votes.voter': userId }, {
    $set: {
      'votes.$.voteType': voteType
    }
  }, { useFindAndModify: false });
};

/**
 * Gets questions in the database
 * @param {string} offset
 * @param {string} limit
 * @returns {object} a questions object
 */
const findAllQuestions = async (offset, limit) => {
  const questions = await Question.find({})
    .populate('owner')
    .populate('answers')
    .skip(offset)
    .limit(limit);
  return questions;
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
  findVotedQuestion,
  insertVote,
  updateVote,
  findAllQuestions,
  createQuestion,
  addAnswerToQuestion
};
