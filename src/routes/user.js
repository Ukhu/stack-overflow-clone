import express from 'express';
import UserController from '../controllers/UserControllers';
import middlewares from '../middlewares';

const user = express.Router();
const SEARCH_URL = '/search';

const { search } = UserController;
const {
  verifyToken,
  UserValidators: { searchValidators }
} = middlewares;

// search route
user.get(`${SEARCH_URL}`, verifyToken, searchValidators(), search);

export default user;
