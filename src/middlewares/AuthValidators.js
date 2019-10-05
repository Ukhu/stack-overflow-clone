import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const {
  Validators: {
    checkDisplayName, checkEmail, checkPassword, genericCheck
  }
} = helpers;

/**
 * @class AuthValidators
 * @classdesc group of validation middlewares related to authentication
 */
export default class AuthValidators {
  /**
   * @method signupValidators
   * @description validates the signup fields
   * @returns {array} of validation middlewares
   */
  static signupValidators() {
    return [
      checkDisplayName(),
      checkEmail(),
      checkPassword(),
      validationErrorHandler
    ];
  }

  /**
   * @method loginValidators
   * @description validates the login fields
   * @returns {array} of validation middlewares
   */
  static loginValidators() {
    return [
      checkEmail(),
      genericCheck('password'),
      validationErrorHandler
    ];
  }
}
