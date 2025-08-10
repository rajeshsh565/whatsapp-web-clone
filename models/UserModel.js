import mongoose from "mongoose";

const users = new mongoose.Schema({
  name: String,
  phone: String,
  password: String
}, { timestamps: true });

export default mongoose.model("Users", users);