import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";
import MediaLightbox from "./ui/MediaLightbox";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    requestStatus,
    currentRequestId,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const scrollEnd = useRef();

  // Request to send first message
  const handleRequestToChat = async () => {
    if (selectedUser) {
      await sendChatRequest(selectedUser._id);
    }
  };

  // Handle selecting an image
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Cancel image preview
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // handle sending a message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() && !imagePreview) {
      return null;
    }

    if (imagePreview) {
      await sendMessage({ text: input.trim(), image: imagePreview });
      handleCancelImage();
      setInput("");
    } else {
      await sendMessage({ text: input.trim() });
      setInput("");
    }
  };

  useEffect(() => {
    if (selectedUser && requestStatus === "accepted") {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, requestStatus]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className="h-full flex flex-col relative bg-slate-900/10">
      {/* Lightbox Modal for Shared Images */}
      <MediaLightbox src={activeLightboxImg} onClose={() => setActiveLightboxImg(null)} />

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl z-10">
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
        >
          ←
        </button>

        <Avatar src={selectedUser.profilePic} name={selectedUser.fullName} isOnline={isOnline} size="md" />

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base leading-snug truncate">
            {selectedUser.fullName}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-emerald-400" : "bg-slate-600"
              }`}
            />
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {requestStatus === "accepted" && (
            <Badge variant="emerald" size="sm" className="hidden sm:inline-flex">
              Connected
            </Badge>
          )}
        </div>
      </div>

      {/* Main Area: Conditionally render Chat vs Request Banners */}
      {requestStatus === "accepted" ? (
        <>
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {messages.length === 0 ? (
              <EmptyState
                title={`Say hello to ${selectedUser.fullName}`}
                description="Your conversation is ready. Send a text or photo to start messaging!"
                className="my-auto border-none bg-transparent"
              />
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === authUser._id;
                return (
                  <div
                    key={msg._id || index}
                    className={`flex items-end gap-2.5 ${
                      isMe ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                  >
                    {!isMe && (
                      <Avatar
                        src={selectedUser?.profilePic}
                        name={selectedUser?.fullName}
                        size="sm"
                        className="mb-1"
                      />
                    )}

                    <div
                      className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {msg.image ? (
                        <div
                          onClick={() => setActiveLightboxImg(msg.image)}
                          className="rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer hover:opacity-95 transition-opacity"
                        >
                          <img
                            src={msg.image}
                            className="max-w-full max-h-[280px] object-cover rounded-2xl"
                            alt="Shared media"
                          />
                        </div>
                      ) : null}

                      {msg.text ? (
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-md text-sm leading-relaxed break-words ${
                            isMe
                              ? "btn-primary text-white rounded-br-none"
                              : "glass-panel text-gray-100 rounded-bl-none border border-white/10"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ) : null}

                      <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>

                    {isMe && (
                      <Avatar
                        src={authUser?.profilePic}
                        name={authUser?.fullName}
                        size="sm"
                        className="mb-1"
                      />
                    )}
                  </div>
                );
              })
            )}
            <div ref={scrollEnd}></div>
          </div>

          {/* Input & Image Preview Area */}
          <div className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-white/10">
            {/* Image Upload Preview Overlay */}
            {imagePreview && (
              <div className="mb-3 p-2 bg-slate-800/80 rounded-2xl border border-white/10 flex items-center justify-between gap-3 max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <span className="text-xs text-gray-300 font-medium truncate">
                    Image attached
                  </span>
                </div>
                <button
                  onClick={handleCancelImage}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 max-w-4xl mx-auto"
            >
              <div className="flex-1 flex items-center glass-input rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-violet-500/30 transition-all">
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2 text-sm"
                />

                <input
                  onChange={handleSelectImage}
                  type="file"
                  id="image-input"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                />
                <label
                  htmlFor="image-input"
                  className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-gray-400 hover:text-violet-400"
                  title="Attach photo"
                >
                  🖼️
                </label>
              </div>

              <button
                type="submit"
                disabled={!input.trim() && !imagePreview}
                className="p-3.5 btn-primary rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <img
                  src={assets.send_button}
                  className="w-4 h-4 invert"
                  alt="Send"
                />
              </button>
            </form>
          </div>
        </>
      ) : (
        /* Request Card Banner View */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 glass-panel rounded-3xl border border-white/10 flex flex-col items-center gap-5 shadow-2xl animate-fade-in">
            <Avatar
              src={selectedUser.profilePic}
              name={selectedUser.fullName}
              isOnline={isOnline}
              size="xl"
            />

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {selectedUser.fullName}
              </h3>
              {selectedUser.bio && (
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  {selectedUser.bio}
                </p>
              )}
            </div>

            {requestStatus === "none" && (
              <div className="w-full pt-2 flex flex-col gap-3">
                <p className="text-xs text-gray-400">
                  Send a chat request to connect and start exchanging messages.
                </p>
                <button
                  onClick={handleRequestToChat}
                  className="w-full py-3.5 btn-primary font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Send Chat Request
                </button>
              </div>
            )}

            {requestStatus === "pending_sent" && (
              <div className="w-full pt-2 flex flex-col items-center gap-2">
                <Badge variant="amber" size="lg" className="w-full py-2.5">
                  ⏳ Chat Request Pending
                </Badge>
                <p className="text-xs text-gray-400 mt-1">
                  Waiting for {selectedUser.fullName} to accept your request.
                </p>
              </div>
            )}

            {requestStatus === "pending_received" && (
              <div className="w-full pt-2 flex flex-col gap-3">
                <p className="text-xs text-gray-300">
                  {selectedUser.fullName} wants to start a conversation with you.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => acceptChatRequest(currentRequestId)}
                    className="flex-1 py-3 btn-primary text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => rejectChatRequest(currentRequestId)}
                    className="py-3 px-5 btn-secondary text-xs font-bold rounded-xl transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {requestStatus === "rejected" && (
              <div className="w-full pt-2 flex flex-col gap-3">
                <Badge variant="red" size="lg" className="w-full py-2.5">
                  Request Declined
                </Badge>
                <button
                  onClick={handleRequestToChat}
                  className="w-full py-3.5 btn-primary font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Send Request Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <EmptyState
        title="Welcome to ChitChat"
        description="Select a conversation from the sidebar or check pending requests to start messaging."
        className="my-auto border-none bg-transparent"
      />
    </div>
  );
};

export default ChatContainer;