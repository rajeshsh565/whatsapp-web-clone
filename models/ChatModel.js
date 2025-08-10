import mongoose from "mongoose";

const chats = new mongoose.Schema({
  chatId: {
    type: String,
    unique: true
  },
  participants: {
    type: Array,
    default: null,
  },
  lastMessage: Object,
  lastTimestamp: Date,
  pinned: Boolean,
  muted: Boolean,
  archived: Boolean,
  deletedBy: {
    type: Array,
    default: null,
  },
  unreadCount: Object, // { user1: 3, user2: 4 }
  selfChat: Boolean
}, { timestamps: true});

export default mongoose.model("Chats", chats);