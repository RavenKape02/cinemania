import { memo, useState, useEffect } from "react";
import { Play, ChevronDown, Heart, X, Star } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogDescription,
  useMorphingDialog,
} from "@/components/motion-primitives/morphing-dialog";
import { GENRE_MAP, fetchMovieDetails } from "@/api/api";

const SPRING = { type: "spring", stiffness: 260, damping: 28 };

function DialogOpener({ as: Tag = "div", className, children, ...rest }) {
  const { setIsOpen } = useMorphingDialog();
  return (
    <Tag
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function DialogDetails({ movie, isFavorite, onToggleFavorite }) {
  const { isOpen } = useMorphingDialog();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      return;
    }
    let ignore = false;
    fetchMovieDetails(movie.id, movie.mediaType).then((data) => {
      if (!ignore) setDetails(data);
    });
    return () => {
      ignore = true;
    };
  }, [isOpen, movie.id, movie.mediaType]);

  const info = details || movie;
  const watchUrl =
    movie.mediaType === "tv"
      ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${movie.id}`;

  return (
    <div className="px-6 md:px-8 py-6 space-y-6">
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

      {!details ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {info.voteAverage > 0 && (
              <span className="text-green-400 font-bold">
                {Math.round(info.voteAverage * 10)}% Match
              </span>
            )}
            {info.year && (
              <span className="text-netflix-light-gray">{info.year}</span>
            )}
            {details.runtime && (
              <span className="text-netflix-light-gray">
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </span>
            )}
            {details.numberOfSeasons && (
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

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-4">
              {details.tagline && (
                <p className="text-white/60 italic text-sm">
                  &ldquo;{details.tagline}&rdquo;
                </p>
              )}
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                {info.overview}
              </p>
            </div>
            <div className="space-y-3 text-sm">
              {details.cast?.length > 0 && (
                <p>
                  <span className="text-netflix-gray">Cast: </span>
                  <span className="text-white/80">
                    {details.cast.slice(0, 5).join(", ")}
                  </span>
                </p>
              )}
              {details.genres?.length > 0 && (
                <p>
                  <span className="text-netflix-gray">Genres: </span>
                  <span className="text-white/80">
                    {details.genres.join(", ")}
                  </span>
                </p>
              )}
              {details.director && (
                <p>
                  <span className="text-netflix-gray">Director: </span>
                  <span className="text-white/80">{details.director}</span>
                </p>
              )}
            </div>
          </div>

          {details.similar?.length > 0 && (
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
                      className="rounded overflow-hidden bg-netflix-black"
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
  );
}

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  if (!movie || !movie.image) return null;

  const genreNames = (movie.genreIds || [])
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const watchUrl =
    movie.mediaType === "tv"
      ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${movie.id}`;

  return (
    <MorphingDialog transition={SPRING}>
      <div className="group/card relative flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] cursor-pointer">
        {/* Poster — the morphing trigger */}
        <MorphingDialogTrigger className="block w-full rounded overflow-hidden aspect-[2/3] bg-netflix-dark">
          <MorphingDialogImage
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        </MorphingDialogTrigger>

        {/* Hover expanded card — hidden on touch devices, click opens dialog */}
        <DialogOpener className="card-hover-preview absolute top-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[320px] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible group-hover/card:scale-100 scale-90 transition-all duration-200 z-30 pointer-events-none group-hover/card:pointer-events-auto origin-top cursor-pointer">
          <div className="rounded-md overflow-hidden shadow-2xl shadow-black/80 bg-netflix-dark">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={movie.backdropMd || movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-sm truncate text-shadow">
                  {movie.title}
                </h3>
              </div>
            </div>

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
                  <Heart
                    size={14}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                <div className="flex-1" />
                <DialogOpener
                  as="button"
                  className="w-8 h-8 rounded-full border-2 border-white/40 text-white/60 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                  aria-label="More info"
                >
                  <ChevronDown size={16} />
                </DialogOpener>
              </div>

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
        </DialogOpener>
      </div>

      {/* Dialog content — portalled, only mounts when open */}
      <MorphingDialogContainer>
        <MorphingDialogContent className="w-full max-w-3xl mx-4 rounded-lg bg-netflix-dark shadow-2xl relative">
          <MorphingDialogClose className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-netflix-dark/80 flex items-center justify-center hover:bg-netflix-dark transition-colors">
            <X size={20} className="text-white" />
          </MorphingDialogClose>

          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <MorphingDialogImage
              src={movie.backdrop || movie.backdropMd || movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <MorphingDialogTitle className="text-2xl md:text-4xl font-black text-white text-shadow-lg">
                {movie.title}
              </MorphingDialogTitle>
            </div>
          </div>

          <MorphingDialogDescription disableLayoutAnimation>
            <DialogDetails
              movie={movie}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </MorphingDialogDescription>
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

export default memo(MovieCard);
