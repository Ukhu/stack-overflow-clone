import express from 'express';
import auth from './auth';
import user from './user';
import question from './question';
import answer from './answer';

const router = express.Router();

router.use('/api/v1', auth, user, question, answer);

export default router;
