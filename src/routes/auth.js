import express from 'express';
import * as AuthControllers from '../controllers/auth';
import middlewares from '../middlewares';

const auth = express.Router();
const AUTH_URL = '/auth';

const { signup, login } = AuthControllers;
const { AuthValidators: { signupValidators, loginValidators } } = middlewares;

// sign up route
auth.post(`${AUTH_URL}/signup`, signupValidators(), signup);

// login route
auth.post(`${AUTH_URL}/login`, loginValidators(), login);

export default auth;
