import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const { Validators: { checkTitle, checkBody, checkTags } } = helpers;

/**
 * @class QuestionValidators
 * @classdesc group of validation middlewares related to questions
 */
export default class QuestionValidators {
  /**
   * @method askQuestionValidators
   * @description validates the ask question fields
   * @returns {array} of validation middlewares
   */
  static askQuestionValidators() {
    return [
      checkTitle(),
      checkBody(),
      checkTags(),
      validationErrorHandler
    ];
  }
}
