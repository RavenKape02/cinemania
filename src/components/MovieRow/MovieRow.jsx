import { useRef, useState, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard/MovieCard";

function MovieRow({ title, movies, favoritesSet, onToggleFavorite, onMovieClick }) {
  const rowRef = useRef(null);
  const rafRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  if (!movies || movies.length === 0) return null;

  const checkScrollButtons = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!rowRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeft(scrollLeft > 20);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
    });
  }, []);

  const scroll = useCallback(
    (direction) => {
      if (!rowRef.current) return;
      const scrollAmount = rowRef.current.clientWidth * 0.85;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 400);
    },
    [checkScrollButtons]
  );

  return (
    <div className="relative group/row mb-8 md:mb-10">
      <h2 className="text-lg md:text-xl font-bold text-white px-4 md:px-12 mb-2 md:mb-3">
        {title}
      </h2>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 w-10 md:w-14 z-20 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} className="text-white" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={checkScrollButtons}
          className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favoritesSet ? favoritesSet.has(movie.id) : false}
              onToggleFavorite={onToggleFavorite}
              onClick={onMovieClick}
            />
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 w-10 md:w-14 z-20 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(MovieRow);
