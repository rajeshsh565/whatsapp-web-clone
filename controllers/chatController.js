import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const getAllUserChats = async(req,res) => {
  const user_id = req.user.id;
  try {
    const user = await User.findOne({_id: user_id});
    if(!user){
      return res.status(400).json({msg:'User does not exists!'});
    }
    const allChats = await Chat.find({participants: user.phone}).sort({lastTimestamp:-1}).lean();
    for (const chat of allChats){
      const processed_messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).lean();
      chat.messages = processed_messages;
    }
    return res.status(200).json({chats: allChats});
  } catch (error) {
    console.log("getAllUserChats error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

export const getSingleChat = async(req,res) => {
  const user_id = req.user.id;
  const { chatId } = req.query;
  try {
    const user = await User.findOne({_id: user_id});
    if(!user){
      return res.status(400).json({msg:'User does not exists!'});
    }
    const updatedChat = await Chat.findOne({chatId}).lean();
    if(!updatedChat){
      return res.status(400).json({ msg: `Chat ${chatId} not found!` });
    }
    const processed_messages = await Message.find({ chat: updatedChat._id }).sort({ createdAt: 1 }).lean();
    updatedChat.messages = processed_messages;
    return res.status(200).json({updatedChat});
  } catch (error) {
    console.log("getSingleChat error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

export const createNewMessage = async(req,res) => {
  const user_id = req.user.id;
  const { msgObj, activeChat } = req.body;
  const { text, from, to, createdAt, _id } = msgObj;
  const { chatId, participants, pinned, muted, archived, deletedBy, unreadCount, selfChat } = activeChat;
  // const new_msg_id = `wamid.${uuidv4()}`;
  try {
    const user = await User.findOne({_id: user_id});
    if(!user){
      return res.status(400).json({msg:'User does not exists!'});
    }
    const chat = await Chat.findOne({ chatId });
    let newChat;
    if(!chat){
      console.log('new chat detected, creating...', );
      const newChatData = {
        chatId,
        participants,
        lastMessage: {
          _id,
          text
        },
        lastTimestamp: createdAt,
        pinned,
        muted,
        archived,
        deletedBy,
        unreadCount,
        selfChat
      }
      if(selfChat){
        newChatData.unreadCount[participants[0]] = 0
      }
      // create new chat
      newChat = await Chat.create(newChatData);
    }
    const chatData = {
      lastMessage: {
        _id,
        text
      },
      lastTimestamp: createdAt,
      unreadCount
    }
    if(selfChat){
      chatData.unreadCount[participants[0]] = 0
    }
    // update chat
    await Chat.findOneAndUpdate({ chatId }, chatData);
    const msgData = {
      _id,
      chat: chat ? chat._id : newChat._id,
      type: 'text',
      text,
      from,
      to,
      status: (msgObj.status && msgObj.status!=="sending") ? msgObj.status : 'delivered',
      createdAt,
    }
    if(selfChat){
      msgData.status = 'read'
    }
    // create new message
    await Message.create(msgData);
    return res.status(200).json({msg: 'Message created successfully!'});
  } catch (error) {
    console.log("createNewMessage error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

export const updateMessageStatus = async(req,res) => {
  const user_id = req.user.id;
  const { msg_ids, chat_id, unreadCount } = req.body;
  try {
    const user = await User.findOne({_id: user_id});
    if(!user){
      return res.status(400).json({msg:'User does not exists!'});
    }
    const manyRes = await Message.updateMany({_id: { $in: msg_ids }}, { status: 'read' });
    if(unreadCount){
      await Chat.findOneAndUpdate({chatId: chat_id}, { unreadCount });
    }
    return res.status(200).json({ msg: "Messages Status updated!"});
  } catch (error) {
    console.log("updateMessageStatus error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}