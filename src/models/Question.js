import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const questionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  answers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Answer'
  }],
  votes: [{
    voter: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: String,
      required: true
    }
  }]
});

questionSchema.plugin(timestamp);

const Question = mongoose.model('Question', questionSchema);

export default Question;
