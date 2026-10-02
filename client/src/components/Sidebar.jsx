import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";
import { UserItemSkeleton } from "./ui/SkeletonLoader";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    pendingRequests,
    acceptChatRequest,
    rejectChatRequest,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' | 'requests'

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-slate-950/40 backdrop-blur-xl border-r border-white/5">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="md" />
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-white leading-none mb-1">
                {authUser?.fullName || "ChitChat"}
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">Online</span>
            </div>
          </div>

          <div className="relative group">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10">
              <img src={assets.menu_icon} alt="menu" className="w-5 h-5 opacity-80" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-2xl glass-panel shadow-2xl hidden group-hover:block z-50 border border-white/10 animate-fade-in">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 text-gray-200 hover:text-white"
              >
                <span>👤</span> Edit Profile
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-900/80 rounded-xl mb-3 border border-white/5">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "chats"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "requests"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Requests</span>
            {pendingRequests.length > 0 && (
              <Badge variant="amber" size="sm">
                {pendingRequests.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <img
            src={assets.search_icon}
            alt="Search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 opacity-50 pointer-events-none"
          />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full glass-input rounded-xl py-2.5 pl-10 pr-8 text-xs focus:outline-none transition-all placeholder-gray-500"
            placeholder="Search conversations..."
          />
          {input && (
            <button
              onClick={() => setInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1">
        {activeTab === "chats" ? (
          filteredUsers.length === 0 ? (
            <EmptyState
              title={input ? "No users found" : "No conversations yet"}
              description={
                input
                  ? `No user matching "${input}"`
                  : "Search for users or check pending requests to connect."
              }
              className="py-10"
            />
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUser?._id === user._id;
              const isOnline = onlineUsers.includes(user._id);

              return (
                <div
                  onClick={() => {
                    setSelectedUser(user);
                    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                  }}
                  key={user._id}
                  className={`group relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-violet-600/25 border border-violet-500/40 shadow-lg shadow-violet-600/10"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Avatar
                    src={user?.profilePic}
                    name={user.fullName}
                    isOnline={isOnline}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3
                        className={`font-semibold text-sm truncate ${
                          isSelected ? "text-white" : "text-gray-200 group-hover:text-white"
                        }`}
                      >
                        {user.fullName}
                      </h3>
                      {unseenMessages[user._id] > 0 && (
                        <Badge variant="violet" size="sm">
                          {unseenMessages[user._id]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOnline ? "bg-emerald-400" : "bg-slate-600"
                        }`}
                      />
                      {isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div>
            {pendingRequests.length === 0 ? (
              <EmptyState
                title="All caught up!"
                description="No pending chat requests at the moment."
                className="py-10"
              />
            ) : (
              pendingRequests.map((reqItem) => {
                const sender = reqItem.sender;
                return (
                  <div
                    key={reqItem._id}
                    className="p-3.5 glass-panel rounded-2xl mb-2.5 flex flex-col gap-3 border border-amber-500/20 shadow-lg animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={sender?.profilePic}
                        name={sender?.fullName || "User"}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {sender?.fullName || "Unknown User"}
                        </h4>
                        <p className="text-[11px] text-amber-400 font-medium truncate">
                          Wants to start a conversation
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptChatRequest(reqItem._id)}
                        className="flex-1 py-1.5 px-3 btn-primary text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectChatRequest(reqItem._id)}
                        className="py-1.5 px-3 btn-secondary text-xs font-bold rounded-xl transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;