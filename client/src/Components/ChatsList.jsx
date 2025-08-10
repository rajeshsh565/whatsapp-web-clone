import { useState } from "react";
import { NewMessageIcon, SearchIcon, ThreeDotMenuIcon } from "../utils/Icons";
import ChatListItem from "./ChatListItem";
import { AnimatePresence } from "framer-motion";
import MessageSiderbar from "./MessageSiderbar";
import { useDashboardContext } from "../Pages/Dashboard";

const ChatsList = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showMessageSheet, setShowMessageSheet] = useState(false);

  const dashboardContext = useDashboardContext();

  const { allChats, activeChat, allUsers, user:currentUser } = dashboardContext || {};

  return (
    <div className="flex flex-col flex-2 min-w-[calc((100vw-4rem)/3)] gap-2 relative overflow-x-hidden bg-base-300 border-l border-l-gray-700">
      {/* Whatsapp Header */}
      <div className="flex justify-between items-center min-h-14 px-4">
        <h1 className="text-xl font-bold select-none">WhatsApp</h1>
        <div className="flex gap-2">
          <div className="cursor-pointer rounded-full hover:bg-base-100 active:bg-base-100 p-2">
            <NewMessageIcon onClick={() => setShowMessageSheet(true)} />
          </div>
          <div className="cursor-pointer rounded-full hover:bg-base-100 active:bg-base-100 p-2">
            <ThreeDotMenuIcon />
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="relative flex items-center mx-4">
        <div className="absolute left-3 z-10">
          <SearchIcon />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search or start a new chat"
          className="input w-full ps-10 !outline-0"
          autoComplete="off"
        />
      </div>
      {/* Tags/Filters */}
      <div className="flex gap-2 flex-wrap mx-4 transition-all">
        <div
          className={`badge ${
            selectedFilter === "all" ? "badge-secondary" : "badge-outline"
          } cursor-pointer hover:badge-secondary`}
          onClick={() => setSelectedFilter("all")}
        >
          <p>All</p>
        </div>
        <div
          className={`badge ${
            selectedFilter === "unread" ? "badge-secondary" : "badge-outline"
          } cursor-pointer hover:badge-secondary`}
          onClick={() => setSelectedFilter("unread")}
        >
          <p>Unread</p>
        </div>
        <div
          className={`badge ${
            selectedFilter === "favourites"
              ? "badge-secondary"
              : "badge-outline"
          } cursor-pointer hover:badge-secondary`}
          onClick={() => setSelectedFilter("favourites")}
        >
          <p>Favourites</p>
        </div>
        <div
          className={`badge ${
            selectedFilter === "groups" ? "badge-secondary" : "badge-outline"
          } cursor-pointer hover:badge-secondary`}
          onClick={() => setSelectedFilter("groups")}
        >
          <p>Groups</p>
        </div>
      </div>
      {/* Chat List */}
      <div className="flex flex-col gap-1 mx-4 overflow-auto h-full">
        {allChats?.map((chat) => {
          return (
            <ChatListItem
              chat={chat}
              activeChatId={activeChat?.chatId}
              counterParty={allUsers.find((user) => {
                const counterPartyPhone = chat?.selfChat ? currentUser?.phone : chat?.participants?.find((ph)=>ph!==currentUser?.phone);
                return user.phone === counterPartyPhone;
              })}
              key={chat?.chatId}
            />
          );
        })}
      </div>
      <AnimatePresence>
        {showMessageSheet && (
          <MessageSiderbar closeSidebar={() => setShowMessageSheet(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatsList;