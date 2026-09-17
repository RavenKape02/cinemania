import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getWatchUrl } from "@/api/api";

export default function PlayerModal({ movie, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!movie) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-2 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Watch ${movie.title}`}
    >
      <div
        className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          autoFocus
          onClick={onClose}
          aria-label="Close player"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
        <iframe
          src={getWatchUrl(movie)}
          title={`Watch ${movie.title}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        />
      </div>
    </div>,
    document.body,
  );
}
