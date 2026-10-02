import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

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

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' | 'requests'

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <img src={assets.logo} alt="logo" className="h-8" />
          <div className="relative group">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <img src={assets.menu_icon} alt="menu" className="w-5 opacity-80" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl glass-panel shadow-xl hidden group-hover:block z-50">
              <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                Edit Profile
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl mb-4 border border-white/5">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "chats"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "requests"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Requests</span>
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <img src={assets.search_icon} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 opacity-50" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500/50 transition-colors placeholder-gray-500"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        {activeTab === "chats" ? (
          filteredUsers.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              key={index}
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-violet-600/20 border border-violet-500/30"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className={`font-medium truncate ${selectedUser?._id === user._id ? "text-white" : "text-gray-200"}`}>
                    {user.fullName}
                  </h3>
                  {unseenMessages[user._id] > 0 && (
                    <span className="bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unseenMessages[user._id]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No pending requests
              </div>
            ) : (
              pendingRequests.map((reqItem) => {
                const sender = reqItem.sender;
                return (
                  <div
                    key={reqItem._id}
                    className="p-3 bg-slate-900/40 border border-white/5 rounded-xl mb-2 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sender?.profilePic || assets.avatar_icon}
                        alt={sender?.fullName || "User"}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {sender?.fullName || "Unknown User"}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate">
                          Wants to start a conversation
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => acceptChatRequest(reqItem._id)}
                        className="flex-1 py-1 px-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectChatRequest(reqItem._id)}
                        className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold rounded-lg transition-all"
                      >
                        Reject
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