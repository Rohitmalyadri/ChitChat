import React from "react";

export const UserItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-slate-800" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-slate-800 rounded w-1/2" />
      <div className="h-2.5 bg-slate-800/70 rounded w-1/3" />
    </div>
  </div>
);

export const ChatMessageSkeleton = ({ isRight = false }) => (
  <div className={`flex items-end gap-3 ${isRight ? "justify-end" : "justify-start"} animate-pulse`}>
    {!isRight && <div className="w-8 h-8 rounded-full bg-slate-800" />}
    <div className={`p-4 rounded-2xl bg-slate-800/60 w-48 h-12 ${isRight ? "rounded-br-none" : "rounded-bl-none"}`} />
  </div>
);

export default UserItemSkeleton;
