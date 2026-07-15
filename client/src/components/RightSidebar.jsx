import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // get all images from all messages

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])


  return selectedUser ? (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="flex flex-col items-center pb-6 border-b border-white/10">
        <div className="relative mb-4">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-violet-500/20"
            alt="Profile"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-[#0f172a] rounded-full"></span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-white mb-1 text-center">
          {selectedUser.fullName}
        </h2>
        <p className="text-sm text-gray-400 text-center max-w-[200px] leading-relaxed">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <div className="py-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Shared Media</h3>
        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-white/10"
              >
                <img src={url} className="w-full h-full object-cover" alt="Shared" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm bg-white/5 rounded-xl border border-white/5 border-dashed">
            No media shared yet
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => logout()}
          className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <img src={assets.logo_icon} className="w-8 opacity-50 grayscale" alt="Logo" />
      </div>
      <p className="text-sm">Select a chat to view profile details</p>
    </div>
  )
}

export default RightSidebar