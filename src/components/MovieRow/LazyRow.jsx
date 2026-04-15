import { useEffect, useRef, useState, memo } from "react";
import MovieRow from "./MovieRow";

function LazyRow({
  title,
  movies: propMovies,
  fetcher,
  favoritesSet,
  onToggleFavorite,
  eager = false,
}) {
  const [movies, setMovies] = useState(propMovies || null);
  const [visible, setVisible] = useState(eager);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (eager || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!visible || movies || !fetcher) return;

    let ignore = false;
    fetcher().then((data) => {
      if (!ignore) setMovies(data);
    });
    return () => {
      ignore = true;
    };
  }, [visible, movies, fetcher]);

  if (!visible) {
    return (
      <div ref={sentinelRef} className="mb-8 md:mb-10 px-4 md:px-12">
        <div className="h-6 w-48 bg-white/10 rounded mb-4" />
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((j) => (
            <div
              key={j}
              className="flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] aspect-[2/3] bg-white/5 rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    if (!fetcher && !propMovies) return null;
    if (movies && movies.length === 0) return null;
    return (
      <div className="mb-8 md:mb-10 px-4 md:px-12">
        <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((j) => (
            <div
              key={j}
              className="flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] aspect-[2/3] bg-white/5 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <MovieRow
      title={title}
      movies={movies}
      favoritesSet={favoritesSet}
      onToggleFavorite={onToggleFavorite}
    />
  );
}

export default memo(LazyRow);
