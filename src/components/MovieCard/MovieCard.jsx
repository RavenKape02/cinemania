import { memo } from "react";
import { Play, ChevronDown, Heart } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { GENRE_MAP } from "@/api/api";

function MovieCard({ movie, isFavorite, onToggleFavorite, onClick, rowId }) {
  if (!movie || !movie.image) return null;

  const genreNames = (movie.genreIds || [])
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const watchUrl =
    movie.mediaType === "tv"
      ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${movie.id}`;

  const layoutBase = `${rowId}-${movie.mediaType || "movie"}-${movie.id}`;
  const cardLayoutId = `card-${layoutBase}`;
  const imageLayoutId = `img-${layoutBase}`;
  const titleLayoutId = `title-${layoutBase}`;

  const handleClick = () => onClick?.(movie, layoutBase);

  return (
    <div className="group/card relative flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] cursor-pointer">
      {/* Poster image */}
      <Motion.div
        layoutId={cardLayoutId}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative rounded overflow-hidden aspect-[2/3] bg-netflix-dark"
        onClick={handleClick}
      >
        <Motion.img
          layoutId={imageLayoutId}
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors" />
      </Motion.div>

      {/* Hover expanded card — hidden on touch devices via @media(hover:hover) in CSS */}
      <div
        className="card-hover-preview absolute top-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[320px] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible group-hover/card:scale-100 scale-90 transition-all duration-200 z-30 pointer-events-none group-hover/card:pointer-events-auto origin-top cursor-pointer"
        onClick={handleClick}
      >
        <div className="rounded-md overflow-hidden shadow-2xl shadow-black/80 bg-netflix-dark">
          {/* Backdrop preview */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={movie.backdropMd || movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <Motion.h3
                layoutId={titleLayoutId}
                className="text-white font-bold text-sm truncate text-shadow"
              >
                {movie.title}
              </Motion.h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(watchUrl, "_blank");
                }}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition-colors"
                aria-label="Play"
              >
                <Play size={16} fill="black" className="text-black ml-0.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(movie);
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isFavorite
                    ? "border-white bg-white/20 text-white"
                    : "border-white/40 text-white/60 hover:border-white hover:text-white"
                }`}
                aria-label={isFavorite ? "Remove from list" : "Add to list"}
              >
                <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <div className="flex-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="w-8 h-8 rounded-full border-2 border-white/40 text-white/60 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                aria-label="More info"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs">
              {movie.voteAverage > 0 && (
                <span className="text-green-400 font-bold">
                  {Math.round(movie.voteAverage * 10)}% Match
                </span>
              )}
              {movie.year && (
                <span className="text-netflix-light-gray">{movie.year}</span>
              )}
              {movie.mediaType === "tv" && (
                <span className="border border-white/30 text-white/70 text-[10px] px-1 rounded">
                  Series
                </span>
              )}
            </div>

            {/* Genres */}
            {genreNames.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/80">
                {genreNames.map((name, i) => (
                  <span key={name}>
                    {name}
                    {i < genreNames.length - 1 && (
                      <span className="text-white/30 mx-1">·</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);
