import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const {
  Validators: {
    checkTitle, checkBody, checkTags, checkNumber
  }
} = helpers;

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

  /**
   * @method viewQuestionsValidators
   * @description validates the view questions fields
   * @returns {array} of validation middlewares
   */
  static viewQuestionsValidators() {
    return [
      checkNumber('page').optional(),
      checkNumber('limit').optional(),
      validationErrorHandler
    ];
  }
}
