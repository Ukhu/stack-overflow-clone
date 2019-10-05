import User from './User';
import Question from './Question';
import Answer from './Answer';

const clearDB = async () => {
  await User.deleteMany({});
  await Question.deleteMany({});
  await Answer.deleteMany({});
};

if (process.env.NODE_ENV === 'test') clearDB();

export default {
  User,
  Question,
  Answer
};
