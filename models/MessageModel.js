import mongoose from "mongoose";

const processed_messages = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  chat: {
    type: mongoose.Types.ObjectId,
    ref: "Chats",
  },
  type: {
    type: String,
    default: "text",
  },
  text: String,
  from: String,
  to: String,
  status: {
    type: String,
    enum: ['delivered', 'read'],
    default: 'delivered'
  }
}, { timestamps: true });

export default mongoose.model("Processed_Messages", processed_messages);