import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(timestamp);

const User = mongoose.model('User', userSchema);

export default User;
