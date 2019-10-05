import User from './User';
import Question from './Question';

const clearDB = async () => {
  await User.deleteMany({});
  await Question.deleteMany({});
};

if (process.env.NODE_ENV === 'test') clearDB();

export default {
  User,
  Question
};
