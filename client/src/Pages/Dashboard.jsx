import ChatsList from "../Components/ChatsList";
import Chat from "../Components/Chat";
import Sidebar from "../Components/Sidebar";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { redirect, useLoaderData } from "react-router-dom";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import whatsappBg from "../assets/whatsapp-default-chat-latest-edited.png";
import { socket, useSocket } from "../socket/socket";
import { isEqual } from "lodash";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/user/current-user");
    const user = data?.user;
    if (!user) {
      console.log("user not logged in.");
      return redirect("/login");
    }
    return user;
  } catch (error) {
    console.error("user check error: ", error);
    return redirect("/login");
  }
};

const DashboardContext = createContext();

const Dashboard = () => {
  const user = useLoaderData();
  const [allUsers, setAllUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [counterParty, setCounterParty] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const allChatsRef = useRef(allChats);

  const fetchAllChats = async () => {
    const { data: all_chats } = await customFetch.get("/chat/all-user-chats");
    setAllChats(all_chats?.chats);
  };
  const fetchAllUsers = async () => {
    const { data: all_users } = await customFetch.get("/user/all-users");
    setAllUsers(all_users?.users);
  };
  const updateAllChatsForActiveChat = (active_chat_update) => {
    setAllChats((prevChats)=>{
      const index = prevChats?.findIndex((chat)=>chat.chatId===active_chat_update.chatId);
      if(index===-1){
        toast.error('Something went wrong!');
        return prevChats;
      }
      const updated_chats = [...prevChats];
      updated_chats[index] = active_chat_update;
      updated_chats[index].status = (updated_chats[index].status==='read') ? 'read' : active_chat_update.status;
      updated_chats.sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
      return updated_chats;
    })
  }
  const fetchChatFromDB = async (chatId) => {
    console.log('fetching chat from db->', );
    try {
      const { data } = await customFetch.get(
        `/chat/single-chat?chatId=${chatId}`
      );
      const fetchedAt = new Date();
      if (
        fetchedAt < new Date(activeChat?.messages?.slice(-1)?.[0]?.createdAt)
      ) {
        console.log('fetchedAt time older than last message time->', );
        return;
      }
      console.log('updating all chats with new data->', data.updatedChat);
      updateAllChatsForActiveChat(data.updatedChat);
    } catch (error) {
      console.error("fetch chat error->", error);
    }
  };
  const updateMessageStatusInDBToRead = async (
    unread_msg_ids,
    chat_id,
    updated_unread_count
  ) => {
    const payload = {
      msg_ids: unread_msg_ids,
      chat_id,
      unreadCount: updated_unread_count,
    };
    console.log("payload for updating msg->", payload);
    try {
      await customFetch.put("/chat/update-message-status", payload);
      console.log("msg updated, now fetching changes from db->");
      fetchChatFromDB(chat_id);
    } catch (error) {
      console.error("error in updating message status: ", error);
    }
  };
  const saveMessageInDB = async(payload, shouldFetch) => {
    console.log("newMsg payload being sent to db->", payload);
    await customFetch.post("/chat/new-message", payload);
    shouldFetch && fetchChatFromDB(payload.activeChat.chatId);
  }

  const handleReceiverOffline = (payload) => {
    console.log('receiver offline->', );
    saveMessageInDB(payload, true);
  }

  const handleReceiverAFK = (payload) => {
    console.log('receiver afk->', );
    saveMessageInDB(payload, true);
  }

  const handleSocketReceiveMessage = (payload) => {
    const { msgObj, activeChat: active_chat } = payload;
    const chatId = active_chat.chatId;
    const all_chats = structuredClone(allChatsRef.current);
    const chat = all_chats.find((chat) => chat.chatId === chatId);
    chat.messages = [...chat.messages, msgObj];
    chat.lastMessage = {
      _id: msgObj._id,
      text: msgObj.text,
    };
    chat.lastTimestamp = msgObj.createdAt;
    if (chatId === activeChat?.chatId) {
      chat.unreadCount[user.phone] = 0;
      console.log('chat.unreadCount->', chat.unreadCount);
      socket.emit("readMessage", {payload, newMsg: true, from: payload.msgObj.from});
    } else {
      socket.emit("receiverAFK", payload);
      chat.unreadCount[user.phone] = (chat.unreadCount[user.phone] ?? 0) + 1;
      msgObj.status = "delivered";
    }
    if (chat.selfChat) {
      chat.unreadCount[user.phone] = 0;
    }
    setAllChats(all_chats);
  };

  const handleSocketMsgStatusUpdate = (update_payload) => {
    const { newMsg, payload, msg_ids, chat_id, updated_unread_count } = update_payload;
    console.log('update payload->', update_payload);
    const all_chats = structuredClone(allChatsRef.current);
    const chat = all_chats.find((chat) => newMsg ? (chat.chatId === payload.activeChat.chatId) : (chat.chatId === chat_id));
    console.log('chat found->', chat);
    if(newMsg){
      payload.msgObj.status = 'read';
      saveMessageInDB(payload);
      chat.messages = chat.messages?.map((msg)=>{
        if(msg?._id===payload.msgObj?._id){
          return { ...msg, status: "read" }
        } else return msg;
      });
      chat.lastMessage = {
        _id: payload.msgObj._id,
        text: payload.msgObj.text
      };
      chat.lastTimestamp = payload.msgObj.createdAt;
      console.log('chat after update->', chat);
    } else{
      const alreadyRead = msg_ids.every(id => {
        const msg = chat.messages.find(m => m._id === id);
        return msg?.status === "read";
      });
      if(!alreadyRead){
        console.log('unread found->', );
        chat.messages = chat.messages?.map((msg) =>
          msg_ids?.includes(msg._id) ? { ...msg, status: "read" } : msg
        );
        chat.unreadCount = updated_unread_count;
        // console.log('updating all chats(single chat) as per data received from listener->', all_chats);
        updateMessageStatusInDBToRead(msg_ids, chat_id, updated_unread_count);
      }
    }
    setAllChats(all_chats);
  };

  // open socket connection
  if (user) {
    useSocket(user.phone, handleSocketReceiveMessage, handleReceiverOffline, handleSocketMsgStatusUpdate, handleReceiverAFK);
  }

  useEffect(() => {
    // fetch all users and chats at the session start and store in context
    (async () => {
      try {
        await fetchAllChats();
        await fetchAllUsers();
      } catch (error) {
        console.error("error fetching users: ", error);
      }
    })();
    // preload chat bg wallpaper with invisible image element
    const img = new Image();
    img.src = whatsappBg;

    // add event listener to check change in screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   if (!activeChat) return;

  //   const updatedChat = allChats.find(chat => chat.chatId === activeChat.chatId);
  //   if (!updatedChat) return;

  //   const prevMessages = activeChat.messages || [];
  //   const newMessages = updatedChat.messages || [];

  //   const hasStatusChanged = newMessages.some((newMsg, i) => {
  //     const prevMsg = prevMessages[i];
  //     return prevMsg && newMsg._id === prevMsg._id && newMsg.status !== prevMsg.status;
  //   });

  //   const hasNewMessage = newMessages.length > prevMessages.length;

  //   if (hasStatusChanged || hasNewMessage) {
  //     setActiveChat(structuredClone(updatedChat));
  //   }
  // }, [allChats]);

  // no matter what, changes to active chat must not affect all chats,,, only changes to all chats should affect active chat
  //found the culprit... it only checks for new messages and not status change to existing messages... thats why activeChat isn't updating
  useEffect(() => {
    allChatsRef.current = allChats;
    if (activeChat) {
      const updated_chat = structuredClone(
        allChats.find((chat) => chat.chatId === activeChat.chatId)
      );
      const isUpdated = !isEqual(updated_chat, activeChat);
      if(isUpdated){
        setActiveChat(updated_chat);
      }
    }
  }, [allChats]);

  useEffect(() => {
    if (activeChat) {
      // set counterparty info
      if (activeChat.participants?.length === 1) {
        setCounterParty(user);
      } else {
        const counterPartyPhone = activeChat.participants?.find(
          (p) => p !== user.phone
        );
        const counterParty = allUsers.find(
          (user) => user.phone === counterPartyPhone
        );
        setCounterParty(counterParty);
      }
    }
  }, [activeChat]);

  if (!allChats.length) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="loading loading-xl loading-ring"></div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        user,
        allUsers,
        allChats,
        activeChat,
        counterParty,
        isMobile,
        setActiveChat,
        setAllChats,
        setCounterParty,
        fetchChatFromDB,
        saveMessageInDB,
        updateMessageStatusInDBToRead,
        updateAllChatsForActiveChat
      }}
    >
      <div className="flex h-screen w-screen">
        <Sidebar />
        {(!isMobile || !activeChat) && <ChatsList />}
        {(!isMobile || activeChat) && (
          <div className="flex flex-4">
            <Chat />
          </div>
        )}
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export default Dashboard;
