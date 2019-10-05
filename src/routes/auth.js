import express from 'express';
import UserController from '../controllers/UserControllers';
import middlewares from '../middlewares';

const auth = express.Router();
const AUTH_URL = '/auth';

const { signup, login } = UserController;
const { AuthValidators: { signupValidators, loginValidators } } = middlewares;

// sign up route
auth.post(`${AUTH_URL}/signup`, signupValidators(), signup);

// login route
auth.post(`${AUTH_URL}/login`, loginValidators(), login);

export default auth;
