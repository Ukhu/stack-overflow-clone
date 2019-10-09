import models from '../models';
import helpers from '../helpers';

const { Question } = models;
const { extractQuestions } = helpers;

/**
 * Creates a new question in the database
 * @param {string} ownerId
 * @param {string} title
 * @param {string} body
 * @param {string} tags
 * @returns {object} a question object
 */
const createQuestion = async (ownerId, title, body, tags) => {
  const newQuestion = await Question.create({
    owner: ownerId,
    title,
    body,
    tags: tags ? [...tags] : []
  });
  return newQuestion;
};

/**
 * Finds a question in the database
 * @param {string} questionId
 * @returns {object} a question object
 */
const findQuestion = async (questionId) => {
  const foundQuestion = await Question.findById(questionId);
  let question = foundQuestion;
  if (foundQuestion) {
    question = extractQuestions([foundQuestion]);
  }
  return question;
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
  const results = await Question.find({})
    .populate('owner')
    .populate('answers')
    .skip(offset)
    .limit(limit);
  const questions = extractQuestions(results);
  return questions;
};

/**
 * Searches for a question in the database
 * @param {string} query
 * @returns {object} a questions object
 */
const searchQuestions = async (query) => {
  const results = await Question.find({
    $or: [
      { title: new RegExp(query, 'i') },
      { tags: new RegExp(`^${query}$`, 'i') }
    ]
  })
    .populate('owner')
    .populate('answers');
  const questions = extractQuestions(results);
  return questions;
};

/**
 * Updates a question with an answer
 * @param {string} questionId
 * @param {string} answerId
 * @returns {undefined}
 */
const addAnswerToQuestion = async (questionId, answerId) => {
  await Question.findByIdAndUpdate(questionId, {
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
  searchQuestions,
  createQuestion,
  addAnswerToQuestion
};
