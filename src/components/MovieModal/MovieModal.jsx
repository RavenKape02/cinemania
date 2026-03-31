import { useEffect, useState } from "react";
import { X, Play, Heart, Star } from "lucide-react";
import { fetchMovieDetails } from "@/api/api";

function MovieModal({ movie, isOpen, onClose, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie || !isOpen) {
      setDetails(null);
      return;
    }

    let ignore = false;
    setLoading(true);

    fetchMovieDetails(movie.id, movie.mediaType).then((data) => {
      if (!ignore) {
        setDetails(data);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [movie?.id, movie?.mediaType, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const info = details || movie;
  const watchUrl =
    movie.mediaType === "tv"
      ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${movie.id}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 mt-8 mb-8 max-h-[90vh] overflow-y-auto rounded-lg bg-netflix-dark shadow-2xl scrollbar-hide animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-netflix-dark/80 flex items-center justify-center hover:bg-netflix-dark transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Hero image */}
        <div className="relative aspect-video w-full">
          <img
            src={info.backdrop || info.image}
            alt={info.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />

          {/* Actions over hero */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-white text-shadow-lg">
                {info.title}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(watchUrl, "_blank")}
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2 rounded text-sm hover:bg-white/80 transition-colors"
                >
                  <Play size={18} fill="black" />
                  Play
                </button>
                <button
                  onClick={() => onToggleFavorite?.(movie)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isFavorite
                      ? "border-white bg-white/20"
                      : "border-white/50 hover:border-white"
                  }`}
                  aria-label={isFavorite ? "Remove from list" : "Add to list"}
                >
                  <Heart
                    size={18}
                    className="text-white"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-6 md:px-8 py-6 space-y-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ) : (
            <>
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {info.voteAverage > 0 && (
                  <span className="text-green-400 font-bold">
                    {Math.round(info.voteAverage * 10)}% Match
                  </span>
                )}
                {info.year && (
                  <span className="text-netflix-light-gray">{info.year}</span>
                )}
                {details?.runtime && (
                  <span className="text-netflix-light-gray">
                    {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                  </span>
                )}
                {details?.numberOfSeasons && (
                  <span className="text-netflix-light-gray">
                    {details.numberOfSeasons} Season
                    {details.numberOfSeasons !== 1 ? "s" : ""}
                  </span>
                )}
                {info.voteAverage > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    {info.voteAverage.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-4">
                  {details?.tagline && (
                    <p className="text-white/60 italic text-sm">
                      "{details.tagline}"
                    </p>
                  )}
                  <p className="text-sm md:text-base text-white/90 leading-relaxed">
                    {info.overview}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  {details?.cast?.length > 0 && (
                    <p>
                      <span className="text-netflix-gray">Cast: </span>
                      <span className="text-white/80">
                        {details.cast.slice(0, 5).join(", ")}
                      </span>
                    </p>
                  )}
                  {details?.genres?.length > 0 && (
                    <p>
                      <span className="text-netflix-gray">Genres: </span>
                      <span className="text-white/80">
                        {details.genres.join(", ")}
                      </span>
                    </p>
                  )}
                  {details?.director && (
                    <p>
                      <span className="text-netflix-gray">Director: </span>
                      <span className="text-white/80">{details.director}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Similar titles */}
              {details?.similar?.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-white mb-4">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {details.similar
                      .filter((s) => s.image)
                      .slice(0, 8)
                      .map((s) => (
                        <div
                          key={s.id}
                          className="rounded overflow-hidden bg-netflix-black cursor-pointer hover:ring-1 hover:ring-white/30 transition-all"
                          onClick={() => {
                            /* could open another modal */
                          }}
                        >
                          <img
                            src={s.image}
                            alt={s.title}
                            className="w-full aspect-[2/3] object-cover"
                            loading="lazy"
                          />
                          <div className="p-2">
                            <p className="text-xs text-white/80 truncate">
                              {s.title}
                            </p>
                            {s.voteAverage > 0 && (
                              <p className="text-[10px] text-green-400 mt-0.5">
                                {Math.round(s.voteAverage * 10)}% Match
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
