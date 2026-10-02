import React from "react";
import assets from "../../assets/assets";

const Avatar = ({ src, name = "User", isOnline = false, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };

  const badgeSizeClasses = {
    sm: "w-2.5 h-2.5 border-2",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4.5 h-4.5 border-3",
  };

  const avatarSrc = src && src.trim() !== "" ? src : assets.avatar_icon;

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <img
        src={avatarSrc}
        alt={name}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-2 ring-violet-500/20 shadow-sm bg-slate-800`}
      />
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${
            badgeSizeClasses[size] || badgeSizeClasses.md
          } bg-emerald-500 border-[#0f172a] rounded-full shadow-sm animate-pulse-glow`}
        />
      )}
    </div>
  );
};

export default Avatar;
