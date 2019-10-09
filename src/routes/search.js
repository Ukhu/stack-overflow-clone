import express from 'express';
import searchResources from '../controllers/search';
import middlewares from '../middlewares';

const search = express.Router();
const SEARCH_URL = '/search';

const {
  verifyToken,
  SearchValidators,
} = middlewares;

// search route
search.get(`${SEARCH_URL}`, verifyToken, SearchValidators(), searchResources);

export default search;
