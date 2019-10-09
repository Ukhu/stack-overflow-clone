import helpers from '../helpers';
import validationErrorHandler from './validationErrorHandler';

const { Validators: { genericCheck, checkSearchType } } = helpers;

/**
   * @method searchValidators
   * @description validates the search query fields
   * @returns {array} of validation middlewares
   */
export default () => [
  checkSearchType(),
  genericCheck('value'),
  validationErrorHandler
];
