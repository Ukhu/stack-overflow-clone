import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const {
  Validators: {
    checkTitle, checkBody, checkTags, checkNumber, checkVote, checkID
  }
} = helpers;

/**
 * @method askQuestionValidators
 * @description validates the ask question fields
 * @returns {array} of validation middlewares
 */
export const askQuestionValidators = () => [
  checkTitle(),
  checkBody(),
  checkTags(),
  validationErrorHandler
];

/**
 * @method viewQuestionsValidators
 * @description validates the view questions fields
 * @returns {array} of validation middlewares
 */
export const viewQuestionsValidators = () => [
  checkNumber('page').optional(),
  checkNumber('limit').optional(),
  validationErrorHandler
];

/**
 * @method singleQuestionValidators
 * @description validates the fields for viewing a single question
 * @returns {array} of validation middlewares
 */
export const singleQuestionValidators = () => [
  checkID('questionId'),
  validationErrorHandler
];

/**
 * @method voteQuestionValidators
 * @description validates the vote question fields
 * @returns {array} of validation middlewares
 */
export const voteQuestionValidators = () => [
  checkID('questionId'),
  checkVote(),
  validationErrorHandler
];
