import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const answerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  body: {
    type: String,
    required: true
  }
});

answerSchema.plugin(timestamp);

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
