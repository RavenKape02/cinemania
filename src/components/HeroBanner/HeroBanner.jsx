import { Play, Info } from "lucide-react";
import { GENRE_MAP } from "@/api/api";

function HeroBanner({ movie, onMoreInfo }) {
  if (!movie) return null;

  const genreNames = (movie.genreIds || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const watchUrl =
    movie.mediaType === "tv"
      ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${movie.id}`;

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] -mt-16 md:-mt-[68px]">
      {/* Backdrop image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-[15%] md:pb-[10%] px-4 md:px-12">
        <div className="max-w-xl md:max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white text-shadow-lg leading-tight">
            {movie.title}
          </h1>

          {genreNames.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              {movie.year && <span>{movie.year}</span>}
              {movie.year && genreNames.length > 0 && (
                <span className="text-white/40">|</span>
              )}
              {genreNames.map((name, i) => (
                <span key={name}>
                  {name}
                  {i < genreNames.length - 1 && (
                    <span className="text-white/40 ml-2">·</span>
                  )}
                </span>
              ))}
              {movie.voteAverage > 0 && (
                <>
                  <span className="text-white/40">|</span>
                  <span className="text-green-400 font-semibold">
                    {Math.round(movie.voteAverage * 10)}% Match
                  </span>
                </>
              )}
            </div>
          )}

          <p className="text-sm md:text-base text-white/90 line-clamp-3 leading-relaxed max-w-lg">
            {movie.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => window.open(watchUrl, "_blank")}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 md:px-8 md:py-3 rounded text-sm md:text-base hover:bg-white/80 transition-colors"
            >
              <Play size={20} fill="black" />
              Play
            </button>
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded text-sm md:text-base hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
