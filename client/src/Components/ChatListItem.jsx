import { useState } from "react";
import {
  ArchiveIcon,
  ArrowDownIcon,
  BellCrossedIcon,
  BellIcon,
  BinIcon,
  MsgStatusReadIcon,
  MsgStatusSendingIcon,
  PinIcon,
  UnreadIcon,
} from "../utils/Icons";
import avatar from "../assets/avatar.png";
import { getDayText } from "../utils/utilMethods";
import { useDashboardContext } from "../Pages/Dashboard";

const ChatListItem = ({ chat, activeChatId, counterParty }) => {
  const [showMenuButton, setShowMenuButton] = useState(false);
  const { user: currentUser, setActiveChat, allChats, setAllChats } = useDashboardContext();

  const renderStatusIcon = () => {
    const msg = chat?.messages.find((msg)=>msg._id===chat?.lastMessage?._id);
    if(!msg){
      return <></>
    }
    if(msg.from!==currentUser?.phone){
      return <></>
    }
    switch(msg.status){
      case 'sending':
        return <MsgStatusSendingIcon className="h-3 w-5 mr-1"/>
      case 'delivered':
        return <MsgStatusReadIcon className="h-3 w-5 mr-1"/>
      case 'read':
        return <MsgStatusReadIcon className="text-[#4fb6ec] h-3 w-5 mr-1"/>
    }
  }

  return (
    <div
      className={`min-h-18 rounded-xl px-2 flex items-center gap-2 w-full cursor-pointer hover:bg-base-100 active:bg-base-100 ${chat?.chatId===activeChatId ? 'bg-base-100' : ''}`}
      onMouseOver={() => setShowMenuButton(true)}
      onMouseOut={() => setShowMenuButton(false)}
      onPointerDown={() => setShowMenuButton(true)}
      onClick={()=>{
        // remove the any empty chat from allChats list...
        const updated_all_chats = structuredClone(allChats.filter((chat)=>chat.messages?.length>0));
        setAllChats(updated_all_chats);
        setActiveChat(structuredClone(chat))
      }}
    >
      <div className="w-[10%] flex justify-center">
        <img src={avatar} alt="avatar" width={40} height={40} />
      </div>
      <div className="flex flex-col justify-center w-[90%] ">
        <div className="flex justify-between">
          <p className="font-bold text-md">{counterParty?.phone===currentUser?.phone ? currentUser?.name+' (You)' : counterParty?.name}</p>
          <p className={`text-xs ${chat?.unreadCount[currentUser?.phone]>0 ? 'text-primary': ''}`}>{getDayText(chat?.lastTimestamp, 'card')}</p>
        </div>
        <div className="flex justify-between items-center">
          {/* <p className="text-sm whitespace-nowrap overflow-hidden overflow-ellipsis w-60 max-w-40 md:max-w-60 flex items-center gap-1">
            <span>{renderStatusIcon()}</span>
            {chat?.lastMessage?.text}
          </p> */}
          <div className="max-w-50 md:max-w-60 flex items-center">
            <span>{renderStatusIcon()}</span>
            <p className="w-full whitespace-nowrap text-sm overflow-hidden overflow-ellipsis">{chat?.lastMessage?.text}</p>
          </div>
          <div className="flex gap-1">
            {chat?.pinned && <PinIcon />}
            {chat?.muted && <BellCrossedIcon />}
            {chat?.unreadCount[currentUser?.phone]>0 && (
              <div className="w-6 h-6 rounded-full text-xs bg-primary text-primary-content flex justify-center items-center font-semibold">
                {chat?.unreadCount?.[currentUser?.phone]}
              </div>
            )}
            {showMenuButton && (
              <div
                className="dropdown dropdown-end"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowDownIcon tabIndex={0} role="button" onClick={(e)=>e.stopPropagation()}/>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52"
                >
                  <li>
                    <a><ArchiveIcon/> Archive Chat</a>
                  </li>
                  <li>
                    <a><BellIcon/> Mute notifications</a>
                  </li>
                  <li>
                    <a><PinIcon/> Pin chat</a>
                  </li>
                  <li>
                    <a><UnreadIcon/> Mark as unread</a>
                  </li>
                  <li>
                    <hr className="cursor-default hover:bg-base-300"/>
                  </li>
                  <li className="text-error">
                    <a><BinIcon className=""/> Delete</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatListItem;
