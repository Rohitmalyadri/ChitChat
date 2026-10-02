import React from "react";

const MediaLightbox = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 glass-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-800 rounded-full text-gray-300 hover:text-white transition-colors border border-white/10 z-10"
          aria-label="Close image preview"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={src}
          alt="Expanded Preview"
          className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
        />
      </div>
    </div>
  );
};

export default MediaLightbox;
