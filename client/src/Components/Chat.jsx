import { useDashboardContext } from "../Pages/Dashboard";
import ChatDefaultScreen from "./ChatDefaultScreen";
import avatar from "../assets/avatar.png";
import whatsappBg from "../assets/whatsapp-default-chat-latest-edited.png";
import { useEffect, useRef, useState } from "react";
import {
  BackArrowIcon,
  MicrophoneIcon,
  PlusIcon,
  SearchIcon,
  SendMessageIcon,
  StickerIcon,
  ThreeDotMenuIcon,
} from "../utils/Icons";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { getDateKey } from "../utils/utilMethods";
import ChatMessageCard from "./ChatMessageCard";
import ContactInfo from "./ContactInfo";
import { socket } from "../socket/socket";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const pendingFeature = "Feature not yet implemented!";
  const {
    activeChat,
    user: currentUser,
    counterParty,
    isMobile,
    setActiveChat,
    saveMessageInDB,
    updateMessageStatusInDBToRead,
    updateAllChatsForActiveChat
  } = useDashboardContext();

  const [showContact, setShowContact] = useState(false);
  const [inputPresent, setInputPresent] = useState(false);
  const newMsg = useRef("");
  const msgInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const emitReadMessage = (
    unread_msg_ids,
    chat_id,
    updated_unread_count,
    counterparty_phone
  ) => {
    const payload = {
      msg_ids: unread_msg_ids,
      chat_id,
      updated_unread_count,
      from: counterparty_phone
    };
    // emit event to show updated message status to sender
    socket.emit("readMessage", payload);
  }

  const handleMessageSend = async() => {
    if (!newMsg.current) return;
    const sentAt = new Date();
    const msgObj = {
      _id: `wamid.${uuidv4()}`,
      text: newMsg.current,
      from: currentUser.phone,
      to: counterParty.phone,
      status: "sending",
      createdAt: sentAt,
    };
    const active_chat_update = structuredClone(activeChat);
    active_chat_update.unreadCount = 
      msgObj.to === msgObj.from
        ? {
          [currentUser.phone]: 0
        } : {
          [currentUser.phone]: 0,
          [counterParty.phone]:
            (active_chat_update.unreadCount?.[counterParty.phone] ?? 0) + 1,
        }
    const payload = {
      msgObj: structuredClone(msgObj),
      activeChat: {...active_chat_update, messages: undefined},
    };
    active_chat_update.messages?.push(msgObj);
    updateAllChatsForActiveChat(active_chat_update);
    // reset newMsg and newMsgInput...
    newMsg.current = "";
    msgInputRef.current.innerText = "";
    setInputPresent(false);
    // emit socket event
    if(msgObj.to===msgObj.from){
      msgObj.selfChat = true;
      // save msg in db
      saveMessageInDB(payload, true);
    } else{
      socket.emit("sendMessage", payload);
    }
  };

  useEffect(() => {
    if (activeChat?.messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
    }
  }, [activeChat?.messages]);

  useEffect(() => {
    if (activeChat && counterParty) {
      // mark all received messages as read and update chat's unread count for current user, both locally as well in db(asychronously)...
      const updatedChat = structuredClone(activeChat);
      const unread_msg_ids = activeChat.messages.filter(
        (msg) => msg.status === "delivered" && msg.from === counterParty.phone
      ).map((msg)=>msg._id);
      console.log('current user.phone->', currentUser.phone);
      console.log('updatedChat->', updatedChat);
      const userUnreadCount = updatedChat.unreadCount[currentUser.phone];
      console.log('user undreadcount->', userUnreadCount);
      if (userUnreadCount > 0) {
        console.log('inside the condition->', );
        // update unread_messages and the count locally
        updatedChat.messages.forEach((msg) => {
          if (msg.from === counterParty.phone && msg.status === "delivered") {
            msg.status = "read";
          }
          return msg;
        });
        updatedChat.unreadCount[currentUser.phone] = 0;

        // update unread_messages and the count in db
        updateMessageStatusInDBToRead(
          unread_msg_ids,
          updatedChat.chatId,
          updatedChat.unreadCount,
        );
        // emit readMessage event to update status locally for counterparty if connected
        emitReadMessage(
          unread_msg_ids,
          updatedChat.chatId,
          updatedChat.unreadCount,
          counterParty.phone
        )
        console.log('updatedChat after setting userunreadcount to 0->', updatedChat);
        updateAllChatsForActiveChat(updatedChat);
      }
    }
  }, [counterParty]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [showContact]);

  return (
    <div className="w-full h-full flex transition-all">
      {(!showContact || !isMobile) && (
        <div
          className={`flex flex-col ${
            showContact ? "w-1/2" : "w-full"
          } h-full bg-base-100 border-l border-l-gray-700 transition-all`}
        >
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex justify-between items-center min-h-14 max-h-14 px-4 bg-base-300 select-none">
                <div
                  className="flex gap-4 items-center cursor-pointer w-full"
                  onClick={() => setShowContact(!showContact)}
                >
                  {isMobile && (
                    <button
                      className="btn btn-ghost px-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChat(null);
                      }}
                    >
                      <BackArrowIcon />
                    </button>
                  )}
                  <img src={avatar} alt="avatar" width={40} height={40} />
                  <h1 className="text-lg font-bold text-start w-full">
                    {currentUser?.phone === counterParty?.phone
                      ? counterParty?.name + " (You)"
                      : counterParty?.name}
                  </h1>
                </div>
                <div className="flex gap-2 items-center">
                  <div
                    className="cursor-pointer rounded-full hover:bg-base-100 active:bg-base-100 p-2"
                    onClick={() => toast.info(pendingFeature)}
                  >
                    <SearchIcon />
                  </div>
                  <div className="cursor-pointer rounded-full hover:bg-base-100 active:bg-base-100 p-2">
                    <ThreeDotMenuIcon
                      className="!w-5 !h-5"
                      onClick={() => toast.info(pendingFeature)}
                    />
                  </div>
                </div>
              </div>
              {/* Chat Message List and New Message Box*/}
              <div
                className="h-[calc(100vh-3.5rem)] bg-base-100 flex flex-col-reverse"
                style={{
                  backgroundImage: `url(${whatsappBg})`,
                }}
              >
                {/* Message Input */}
                <div className="w-full px-4 py-3">
                  <div className="rounded-4xl bg-base-300 flex p-1.25 items-end">
                    <div
                      className="btn btn-circle btn-ghost hover:bg-base-100 active:bg-base-100"
                      onClick={() => toast.info(pendingFeature)}
                    >
                      <PlusIcon />
                    </div>
                    <div
                      className="btn btn-circle btn-ghost hover:bg-base-100 active:bg-base-100"
                      onClick={() => toast.info(pendingFeature)}
                    >
                      <StickerIcon />
                    </div>
                    <div className="w-full flex items-center my-auto relative">
                      {!inputPresent && (
                        <p className="w-full h-full text-sm absolute opacity-75 ps-2">
                          Type a message
                        </p>
                      )}
                      <div
                        contentEditable="plaintext-only"
                        suppressContentEditableWarning
                        className="outline-0 w-full max-w-full max-h-40 my-auto ps-2 overflow-y-auto
                        selection:bg-green-700 selection:text-white text-sm items-center whitespace-pre-wrap break-words z-20"
                        onInput={(e) => {
                          newMsg.current = e.currentTarget.innerText;
                          setInputPresent(newMsg.current.trim().length > 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleMessageSend();
                          }
                        }}
                        ref={msgInputRef}
                      ></div>
                    </div>
                    {inputPresent ? (
                      <div
                        className="btn btn-circle btn-primary p-2"
                        onClick={handleMessageSend}
                      >
                        <SendMessageIcon />
                      </div>
                    ) : (
                      <div
                        className="btn btn-circle btn-ghost hover:bg-base-100 active:bg-base-100"
                        onClick={() => toast.info(pendingFeature)}
                      >
                        <MicrophoneIcon />
                      </div>
                    )}
                  </div>
                </div>
                {/* Chat Messages List */}
                <div
                  className={`py-4 ${
                    isMobile || showContact ? "px-4" : "px-16"
                  } flex flex-col gap-1 overflow-y-auto`}
                >
                  {activeChat.messages?.map((msg, i) => {
                    const dateKey = getDateKey(msg.createdAt);
                    const previousDateKey =
                      i > 0
                        ? getDateKey(activeChat.messages?.[i - 1]?.createdAt)
                        : null;
                    let dayChanged = dateKey !== previousDateKey;
                    return (
                      <ChatMessageCard
                        dayChanged={dayChanged}
                        msg={msg}
                        currentUser={currentUser}
                        counterParty={counterParty}
                        key={msg._id}
                      />
                    );
                  })}
                  <div ref={messagesEndRef}></div>
                </div>
              </div>
            </>
          ) : (
            <ChatDefaultScreen />
          )}
        </div>
      )}
      {showContact && (
        <div className="w-full md:w-1/2 h-full">
          <ContactInfo closeContactInfo={() => setShowContact(false)} />
        </div>
      )}
    </div>
  );
};
export default Chat;
