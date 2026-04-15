import { memo, useState, useEffect } from "react";
import { Play, Info, X, Star, Heart } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogImage,
  useMorphingDialog,
} from "@/components/motion-primitives/morphing-dialog";
import { GENRE_MAP, fetchMovieDetails } from "@/api/api";

const SPRING = { type: "spring", stiffness: 260, damping: 28 };

function HeroDialogDetails({ movie }) {
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
        </>
      )}
    </div>
  );
}

function HeroBanner({ movie }) {
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
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />
      </div>

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

            <MorphingDialog transition={SPRING}>
              <MorphingDialogTrigger className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded text-sm md:text-base hover:bg-white/30 transition-colors backdrop-blur-sm">
                <Info size={20} />
                More Info
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="w-full max-w-3xl mx-4 rounded-lg bg-netflix-dark shadow-2xl relative">
                  <MorphingDialogClose className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-netflix-dark/80 flex items-center justify-center hover:bg-netflix-dark transition-colors">
                    <X size={20} className="text-white" />
                  </MorphingDialogClose>

                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <MorphingDialogImage
                      src={movie.backdrop || movie.image}
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
                    <HeroDialogDetails movie={movie} />
                  </MorphingDialogDescription>
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HeroBanner);
