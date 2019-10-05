import express from 'express';
import auth from './auth';
import question from './question';

const router = express.Router();

router.use('/api/v1', auth, question);

export default router;
