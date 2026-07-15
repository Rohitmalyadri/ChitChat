import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div className="w-full h-screen overflow-hidden bg-[url('/bgImage.svg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-[80px_1fr] lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr_350px] overflow-hidden">

        {/* Sidebar - Hidden on mobile if chat is selected */}
        <div className={`${selectedUser ? 'hidden md:block' : 'block'} h-full border-r border-white/10 bg-slate-900/40 backdrop-blur-md`}>
          <Sidebar />
        </div>

        {/* Chat Area - Shows on mobile if chat is selected, or placeholder if not */}
        <div className={`${!selectedUser ? 'hidden md:block' : 'block'} h-full relative bg-slate-900/20`}>
          <ChatContainer />
        </div>

        {/* Right Sidebar - Hidden on smaller screens */}
        <div className="hidden xl:block h-full border-l border-white/10 bg-slate-900/40 backdrop-blur-md">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
};

export default HomePage;