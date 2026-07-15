import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState("")

  const scrollEnd = useRef();

  // Request to send first message, If a person is new and connecting new person he need to send request to him first, after getting accept message they can continue messaging
  const handleRequestToChat = async () => {
    
  }

  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === " ") {
      return null
    }
    await sendMessage({ text: input.trim() })
    setInput("")
  }


  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return
    }

    const reader = new FileReader
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
    }

    reader.readAsDataURL(file)
    e.target.value = ""
  }


  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])




  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-slate-900/30 backdrop-blur-md z-10">
        <div className="relative">
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="Profile Picture" className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30" />
          {onlineUsers.includes(selectedUser._id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></span>}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg leading-tight">
            {selectedUser.fullName}
          </h3>
          <p className="text-xs text-gray-400">
            {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <img src={assets.arrow_icon} alt="Back" className="w-5 invert" />
          </button>
          <button className="max-md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <img src={assets.help_icon} className="w-5 opacity-70" alt="Help" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"
              }`}
          >
            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                className="w-8 h-8 rounded-full object-cover mb-1"
                alt="User"
              />
            )}

            <div className={`flex flex-col max-w-[70%] ${msg.senderId === authUser._id ? "items-end" : "items-start"}`}>
              {msg.image ? (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={msg.image} className="max-w-full max-h-[300px] object-cover" alt="Shared" />
                </div>
              ) : (
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-md backdrop-blur-sm text-[15px] leading-relaxed break-words ${msg.senderId === authUser._id
                      ? "bg-violet-600 text-white rounded-br-none"
                      : "bg-slate-800/80 text-gray-100 rounded-bl-none border border-white/5"
                    }`}
                >
                  {msg.text}
                </div>
              )}
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>

            {msg.senderId === authUser._id && (
              <img
                src={authUser?.profilePic || assets.avatar_icon}
                className="w-8 h-8 rounded-full object-cover mb-1"
                alt="Me"
              />
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>


      {/* Input Area */}
      <div className="p-4 bg-slate-900/30 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center bg-slate-800/50 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 py-2 text-sm"
            />
            <input onChange={handleSendImage} type="file" id="image" accept="image/png,image/jpeg" hidden />
            <label htmlFor="image" className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors ml-1">
              <img src={assets.gallery_icon} className="w-5 opacity-70 hover:opacity-100 transition-opacity" alt="Gallery" />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full shadow-lg shadow-violet-600/20 transition-all active:scale-95 group"
          >
            <img src={assets.send_button} className="w-5 invert group-hover:scale-110 transition-transform" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8 bg-slate-900/20 backdrop-blur-sm">
      <div className="w-24 h-24 bg-violet-600/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
        <img src={assets.logo_icon} className="w-12 opacity-80" alt="Logo" />
      </div>
      <h2 className="text-3xl font-bold text-white">Welcome to ChitChat</h2>
      <p className="text-gray-400 max-w-md">
        Select a chat from the sidebar to start messaging your friends and family.
      </p>
    </div>
  );
};

export default ChatContainer;