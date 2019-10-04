import { validationResult } from 'express-validator';
import helpers from '../helpers';

const { responseMessage } = helpers;

export default (request, response, next) => {
  const errors = {};
  const errorFormatter = ({ location, msg, param }) => {
    if (!Object.keys(errors).includes(location)) {
      errors[`${location}`] = {};
    }
    errors[`${location}`][`${param}`] = msg;
    return errors;
  };
  const validationResults = validationResult(request).array({ onlyFirstError: true });
  validationResults.forEach((resultObject) => errorFormatter(resultObject));
  if (Object.keys(errors).length > 0) {
    responseMessage(response, 400, { error: errors });
  } else {
    next();
  }
};
