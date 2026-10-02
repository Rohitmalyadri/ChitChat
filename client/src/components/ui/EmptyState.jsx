import React from "react";
import assets from "../../assets/assets";

const EmptyState = ({
  icon,
  title = "No items found",
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-white/5 my-auto ${className}`}
    >
      <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center mb-4 border border-violet-500/20 shadow-inner">
        {icon ? (
          icon
        ) : (
          <img src={assets.logo_icon} className="w-8 opacity-70" alt="Logo" />
        )}
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-2.5 px-5 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
