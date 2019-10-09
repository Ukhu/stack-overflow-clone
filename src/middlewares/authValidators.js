import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const {
  Validators: {
    checkDisplayName, checkEmail, checkPassword, genericCheck
  }
} = helpers;

/**
   * @method signupValidators
   * @description validates the signup fields
   * @returns {array} of validation middlewares
   */
export const signupValidators = () => [
  checkDisplayName(),
  checkEmail(),
  checkPassword(),
  validationErrorHandler
];

/**
   * @method loginValidators
   * @description validates the login fields
   * @returns {array} of validation middlewares
   */
export const loginValidators = () => [
  checkEmail(),
  genericCheck('password'),
  validationErrorHandler
];
