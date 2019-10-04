import { check } from 'express-validator';

/**
 * @class Validors
 * @classdesc express-validator middlewares customized for the different input fields
 */
export default class Validators {
  /**
   * @method genericCheck
   * @description validates the input in the specified field
   * @param {string} field
   * @returns {function} call to express-validator check API middleware
   */
  static genericCheck(field) {
    return check(`${field}`)
      .exists()
      .withMessage(`${field} is required`)
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage(`${field} cannot be blank`);
  }

  /**
   * @method checkDisplayName
   * @description validates the input in the dislpayName field
   * @returns {function} call to the genericCheck validator
   */
  static checkDisplayName() {
    return Validators.genericCheck('displayName')
      .trim()
      .isLength({ min: 2, max: 15 })
      .withMessage('displayName must be at least 8 characters, and maximum 30')
      .isAlphanumeric()
      .withMessage('displayName must be alphanumeric');
  }

  /**
   * @method checkEmail
   * @description validates the input in the email field
   * @returns {function} call to the genericCheck validator
   */
  static checkEmail() {
    return Validators.genericCheck('email')
      .trim()
      .isEmail()
      .withMessage('must be a valid email');
  }

  /**
   * @method checkPassword
   * @description validates the input in the password field
   * @returns {function} call to the genericCheck validator
   */
  static checkPassword() {
    return Validators.genericCheck('password')
      .trim()
      .isLength({ min: 8, max: 15 })
      .withMessage('password must be at least 8 characters, and maximum 15')
      .isAlphanumeric()
      .withMessage('password must be alphanumeric');
  }
}
