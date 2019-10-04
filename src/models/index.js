import User from './User';

const clearDB = async () => {
  await User.deleteOne({});
};

if (process.env.NODE_ENV === 'test') clearDB();

export default {
  User
};
