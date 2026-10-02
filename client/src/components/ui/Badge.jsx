import React from "react";

const Badge = ({ children, variant = "violet", size = "md", className = "" }) => {
  const variantClasses = {
    violet: "bg-violet-600/90 text-white shadow-sm shadow-violet-600/30",
    amber: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    emerald: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
    slate: "bg-slate-800 text-slate-300 border border-white/10",
  };

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.2 rounded-full font-bold min-w-[18px] text-center",
    md: "text-xs px-2.5 py-0.5 rounded-full font-semibold",
    lg: "text-xs px-3 py-1 rounded-xl font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center justify-center transition-all ${
        variantClasses[variant] || variantClasses.violet
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
