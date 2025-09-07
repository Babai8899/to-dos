import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  question: { type: String, required: true },
  response: { type: String, required: true },
  emailId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatHistory', chatHistorySchema);