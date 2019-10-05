import express from 'express';
import auth from './auth';
import question from './question';
import answer from './answer';

const router = express.Router();

router.use('/api/v1', auth, question, answer);

export default router;
