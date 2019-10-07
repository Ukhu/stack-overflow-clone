import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const { Validators: { genericCheck, checkSearchType } } = helpers;

/**
 * @class SearchValidators
 * @classdesc group of validation middlewares related to generic user operations
 */
export default class UserValidators {
  /**
   * @method searchValidators
   * @description validates the search query fields
   * @returns {array} of validation middlewares
   */
  static searchValidators() {
    return [
      checkSearchType(),
      genericCheck('value'),
      validationErrorHandler
    ];
  }
}
