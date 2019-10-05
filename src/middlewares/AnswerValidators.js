import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const { Validators: { checkBody, checkID } } = helpers;

/**
 * @class AnswerValidators
 * @classdesc group of validation middlewares related to answers
 */
export default class AnswerValidators {
  /**
   * @method answerQuestionValidators
   * @description validates the answer fields
   * @returns {array} of validation middlewares
   */
  static answerQuestionValidators() {
    return [
      checkID('questionId'),
      checkBody(),
      validationErrorHandler
    ];
  }
}
