import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const { Validators: { checkBody, checkID } } = helpers;

/**
 * @method answerQuestionValidators
 * @description validates the answer fields
 * @returns {array} of validation middlewares
 */
export default () => [
  checkID('questionId'),
  checkBody(),
  validationErrorHandler
];
