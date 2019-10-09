import { check } from 'express-validator';

/**
 * @method genericCheck
 * @description validates the input in the specified field
 * @param {string} field
 * @returns {function} call to express-validator check API middleware
 */
export const genericCheck = (field) => check(`${field}`)
  .exists()
  .withMessage(`${field} is required`)
  .not()
  .isEmpty({ ignore_whitespace: true })
  .withMessage(`${field} cannot be blank`);

/**
 * @method checkDisplayName
 * @description validates the input in the dislpayName field
 * @returns {function} call to the genericCheck validator
 */
export const checkDisplayName = () => genericCheck('displayName')
  .trim()
  .isLength({ min: 2, max: 15 })
  .withMessage('displayName must be at least 8 characters, and maximum 30')
  .isAlphanumeric()
  .withMessage('displayName must be alphanumeric');

/**
 * @method checkEmail
 * @description validates the input in the email field
 * @returns {function} call to the genericCheck validator
 */
export const checkEmail = () => genericCheck('email')
  .trim()
  .isEmail()
  .withMessage('must be a valid email');

/**
 * @method checkPassword
 * @description validates the input in the password field
 * @returns {function} call to the genericCheck validator
 */
export const checkPassword = () => genericCheck('password')
  .trim()
  .isLength({ min: 8, max: 15 })
  .withMessage('password must be at least 8 characters, and maximum 15')
  .isAlphanumeric()
  .withMessage('password must be alphanumeric');

/**
 * @method checkTitle
 * @description validates the input in the title field
 * @returns {function} call to the genericCheck validator
 */
export const checkTitle = () => genericCheck('title')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('title must be between 3 to 100 characters');

/**
 * @method checkBody
 * @description validates the input in the body field
 * @returns {function} call to the genericCheck validator
 */
export const checkBody = () => genericCheck('body')
  .trim()
  .isLength({ min: 3, max: 1024 })
  .withMessage('body must be between 3 to 1024 characters');

/**
 * @method checkTags
 * @description validates the input in the tags field
 * @returns {function} call to the genericCheck validator
 */
export const checkTags = () => genericCheck('tags')
  .optional()
  .custom((value) => {
    if (!Array.isArray(value)) return false;
    return value;
  })
  .withMessage('tags must be grouped in an array')
  .custom((value) => {
    if (value.length > 5) return false;
    return value;
  })
  .withMessage('a maximum of 5 tags are allowed');

/**
 * @method checkID
 * @description validates the input in the id field
 * @param {string} field
 * @returns {function} call to the genericCheck validator
 */
export const checkID = (field) => genericCheck(`${field}`)
  .custom((value) => {
    if (/^[a-fA-F0-9]{24}$/g.test(value)) return value;
    return false;
  })
  .withMessage(`${field} must be a valid ID`);

/**
 * @method checkNumber
 * @description validates the input for fields containing numbers e.g page and limit
 * @param {string} field
 * @returns {function} call to the genericCheck validator
 */
export const checkNumber = (field) => genericCheck(`${field}`)
  .isInt({ allow_leading_zeroes: false })
  .withMessage(`${field} must be a number`);

/**
 * @method checkVote
 * @description validates the input for voteType field
 * @returns {function} call to the genericCheck validator
 */
export const checkVote = () => genericCheck('voteType')
  .isIn(['up', 'down'])
  .withMessage('voteType must be either up or down');

/**
 * @method checkSearchType
 * @description validates the input for type field for searches
 * @returns {function} call to the genericCheck validator
 */
export const checkSearchType = () => genericCheck('type')
  .isIn(['questions', 'answers', 'users'])
  .withMessage('search type must be either questions, answers or users');
