import { motion } from "framer-motion";
import {
  BackArrowIcon,
  SearchIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "../utils/Icons";
import avatar from "../assets/avatar.png";
import { toast } from "react-toastify";
import { useDashboardContext } from "../Pages/Dashboard";
import { useEffect } from "react";

const MessageSiderbar = ({ closeSidebar }) => {
  const pendingFeature = "Feature not yet implemented!";
  const {
    allUsers,
    user: currentUser,
    allChats,
    setAllChats,
    setActiveChat,
  } = useDashboardContext();

  return (
    <motion.div
      className="absolute w-full h-full z-20 bg-base-300 overflow-y-auto"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
      exit={{ x: "-100%" }}
    >
      {/* Header */}
      <div className="h-10 flex gap-4 items-center mt-2 mx-4">
        <div className="cursor-pointer">
          <BackArrowIcon onClick={() => closeSidebar()} />
        </div>
        <h1 className="text-sm">New chat</h1>
      </div>
      {/* Search Box */}
      <div className="relative flex items-center mx-4">
        <div className="absolute left-3 z-10">
          <SearchIcon />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search name or number"
          className="input w-full ps-10 !outline-0"
          autoComplete="off"
        />
      </div>
      {/* New Conv Menu */}
      <div className="w-full p-4">
        <ul
          className="menu menu-vertical w-full justify-between"
          onClick={() => toast.info(pendingFeature)}
        >
          <li>
            <a className="flex items-center gap-2">
              <UsersIcon />
              New Group
            </a>
          </li>
          <li>
            <a className="flex items-center gap-2">
              <UserPlusIcon />
              New Contact
            </a>
          </li>
          <li>
            <a className="flex items-center gap-2">
              <UserGroupIcon />
              New Community
            </a>
          </li>
        </ul>
      </div>
      {/* All users in whatsapp clone */}
      <div className="flex flex-col mx-4">
        <h1 className="text-sm text-base-content">
          All Users in Whatsapp Web Clone
        </h1>
        <div className="w-full">
          <ul className="menu menu-vertical w-full justify-between">
            {(allUsers || []).map((user) => {
              return (
                // add unique keys to each item, id
                <li
                  key={user._id}
                  onClick={() => {
                    const chat = allChats?.find((ch)=>{
                      if(user.phone === currentUser.phone){
                        return ch.participants?.length===1 && ch.participants?.includes(user.phone);
                      } else{
                        return ch.participants?.includes(user.phone) && ch.participants?.includes(currentUser.phone)
                      }
                    });
                    if(chat){
                      // remove the any empty chat from allChats list...
                      const updated_all_chats = structuredClone(allChats.filter((chat)=>chat.messages?.length>0));
                      setAllChats(updated_all_chats);
                      setActiveChat(structuredClone(chat));
                    } else{
                      const selfChat = currentUser?.phone===user.phone;
                      const newChat = {
                        participants: selfChat ? [currentUser?.phone] : [currentUser?.phone, user?.phone],
                        lastMessage: {},
                        lastTimestamp: null,
                        pinned: false,
                        muted: false,
                        archived: false,
                        deletedBy: [],
                        unreadCount: {
                          [currentUser.phone]: 0,
                          [user.phone]: 0,
                        },
                        messages: [],
                        selfChat
                      }
                      newChat.chatId = newChat.participants.sort((a,b)=>b-a).join('_');
                      setActiveChat(newChat);
                      const all_chats = [...allChats, newChat];
                      setAllChats(all_chats);
                    }
                    closeSidebar();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img src={avatar} alt="avatar" width={40} height={40} />
                    <div>
                      <p>
                        {user.phone === currentUser.phone
                          ? user.name + " (You)"
                          : user.name}
                      </p>
                      <p className="text-xs">Hey there! I'm not online.</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
export default MessageSiderbar;
