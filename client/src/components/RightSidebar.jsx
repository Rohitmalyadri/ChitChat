import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "./ui/Avatar";
import MediaLightbox from "./ui/MediaLightbox";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Extract all shared images from current messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 flex flex-col bg-slate-950/40 backdrop-blur-xl border-l border-white/5">
      {/* Lightbox for inspecting shared photos */}
      <MediaLightbox src={activeLightboxImg} onClose={() => setActiveLightboxImg(null)} />

      {/* User Profile Info Card */}
      <div className="flex flex-col items-center pb-6 border-b border-white/10">
        <Avatar src={selectedUser?.profilePic} name={selectedUser.fullName} isOnline={isOnline} size="xl" className="mb-4" />
        <h2 className="text-lg font-bold text-white mb-1 text-center">
          {selectedUser.fullName}
        </h2>
        <p className="text-xs text-gray-400 text-center max-w-[220px] leading-relaxed">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      {/* Shared Media Gallery Section */}
      <div className="py-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Shared Media
          </h3>
          <span className="text-xs font-semibold text-violet-400 bg-violet-600/10 px-2 py-0.5 rounded-full border border-violet-500/20">
            {msgImages.length}
          </span>
        </div>

        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => setActiveLightboxImg(url)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-85 transition-all border border-white/10 group shadow-md"
              >
                <img
                  src={url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Shared media item"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-xs glass-panel rounded-2xl border border-white/5 border-dashed">
            📷 No media shared yet
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/10 mt-auto">
        <button
          onClick={() => logout()}
          className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 border border-red-500/20 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Logout Session
        </button>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
      <div className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center mb-3 border border-white/5">
        <img src={assets.logo_icon} className="w-7 opacity-40 grayscale" alt="Logo" />
      </div>
      <p className="text-xs text-gray-400">Select a chat to view user details</p>
    </div>
  );
};

export default RightSidebar;