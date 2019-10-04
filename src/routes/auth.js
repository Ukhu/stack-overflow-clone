import express from 'express';
import UserController from '../controllers/UserControllers';
import middlewares from '../middlewares';

const auth = express.Router();
const AUTH_URL = '/auth';

const { signup } = UserController;
const { AuthValidators: { signupValidators } } = middlewares;

auth.post(`${AUTH_URL}/signup`, signupValidators(), signup);

export default auth;
