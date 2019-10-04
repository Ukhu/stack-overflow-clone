import express, { urlencoded, json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import debug from 'debug';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.NODE_ENV === 'development' ? process.env.MONGODB_URI : process.env.MONGODB_URI_TEST;
const log = debug('dev');

// Express Middlewares
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to StackOverflow clone');
});

app.use('*', (req, res) => {
  res.status(404).send('This route does not exist, kindly visit the root route at "/"');
});

app.listen(PORT, () => {
  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

const db = mongoose.connection;

db.on('error', (err) => log(err));

db.once('open', () => {
  log(`Server started on port ${PORT} and database connection successful`);
});

export default app;
