import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import CookieParser from "cookie-parser";
//routers
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
//middlewares
import { validateUser } from "./middlewares/authMiddleware.js";

const port = process.env.PORT || 5100;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(CookieParser());
app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", validateUser, userRouter);
app.use("/api/v1/chat", validateUser, chatRouter);

// setup http server to attach socket.io to it
export const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://192.168.1.101:5173', credentials: true}
});
let messageStatusUpdateCounter = 0;
// setup socket connection
const onlineUsers = new Map();
io.on("connection", (socket)=>{
  socket.on("register", (phone)=>{
    onlineUsers.set(phone, socket.id);
  });
  socket.on("sendMessage", (payload)=>{
    const { msgObj } = payload;
    const receiverSocket = onlineUsers.get(msgObj.to);
    const senderSocket = onlineUsers.get(msgObj.from);
    if(receiverSocket){
      io.to(receiverSocket).emit("receiveMessage", payload);
    } else if(senderSocket){
      io.to(senderSocket).emit("receiverOffline", payload);
    }
  });
  socket.on("receiverAFK", (payload)=>{
    console.log('receiverAFK received->', );
    const senderSocket = onlineUsers.get(payload.msgObj.from);
    console.log('senderSocker->', senderSocket);
    if(senderSocket){
      io.to(senderSocket).emit("receiverAFKUpdate", payload);
      console.log('receiverAFKUpdate fired->', );
    }
  });
  socket.on("readMessage", (update_payload)=>{
    const senderSocket = onlineUsers.get(update_payload.from);
    console.log('readMessage data->', update_payload);
    if(senderSocket){
      io.to(senderSocket).emit("messageStatusUpdate", update_payload);
      console.log('current count->', messageStatusUpdateCounter);
      messageStatusUpdateCounter += 1;
    }
  });
  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) onlineUsers.delete(userId);
    }
  });
})

let connect;

try {
  connect = await mongoose.connect(process.env.MONGODB_URI);
} catch (error) {
  console.log('error during mongodb conn->', error);
}

if(connect){
  server.listen(port, ()=> {
    console.log(`Server with socket listening on port ${port}`);
  })
}