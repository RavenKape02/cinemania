import { useState, useEffect } from "react";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import MovieRow from "@/components/MovieRow/MovieRow";
import MovieCard from "@/components/MovieCard/MovieCard";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRated,
  fetchNowPlaying,
  fetchUpcoming,
  fetchPopularTV,
  fetchByGenre,
} from "@/api/api";

function Home({
  favorites,
  onToggleFavorite,
  onMovieClick,
  searchText,
  searchResults,
  isSearching,
}) {
  const [rows, setRows] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      setLoading(true);

      const [trending, popular, topRated, nowPlaying, upcoming, tvPopular, action, comedy, horror, scifi] =
        await Promise.all([
          fetchTrending(),
          fetchPopularMovies(),
          fetchTopRated(),
          fetchNowPlaying(),
          fetchUpcoming(),
          fetchPopularTV(),
          fetchByGenre(28),
          fetchByGenre(35),
          fetchByGenre(27),
          fetchByGenre(878),
        ]);

      if (ignore) return;

      const heroPool = trending.filter((m) => m.backdrop);
      if (heroPool.length > 0) {
        setHeroMovie(heroPool[Math.floor(Math.random() * Math.min(5, heroPool.length))]);
      }

      setRows([
        { title: "Trending Now", movies: trending },
        { title: "Popular Movies", movies: popular },
        { title: "Now Playing", movies: nowPlaying },
        { title: "Top Rated", movies: topRated },
        { title: "Popular TV Shows", movies: tvPopular },
        { title: "Action", movies: action },
        { title: "Comedy", movies: comedy },
        { title: "Sci-Fi", movies: scifi },
        { title: "Horror", movies: horror },
        { title: "Coming Soon", movies: upcoming },
      ]);

      setLoading(false);
    }

    loadContent();
    return () => { ignore = true; };
  }, []);

  if (isSearching && searchText) {
    return (
      <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Results for "{searchText}"
        </h2>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.some((fav) => fav.id === movie.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onMovieClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-netflix-light-gray text-lg">
              No results found for "{searchText}"
            </p>
            <p className="text-netflix-gray text-sm mt-2">
              Try different keywords or browse categories below
            </p>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        {/* Hero skeleton */}
        <div className="h-[85vh] md:h-[90vh] bg-netflix-dark animate-pulse" />
        {/* Row skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 md:px-12 mb-8">
            <div className="h-6 w-48 bg-white/10 rounded mb-4" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] aspect-[2/3] bg-white/5 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <HeroBanner movie={heroMovie} onMoreInfo={onMovieClick} />

      <div className="-mt-16 md:-mt-24 relative z-10">
        {rows
          .filter((row) => row.movies.length > 0)
          .map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.movies}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onMovieClick={onMovieClick}
            />
          ))}
      </div>
    </div>
  );
}

export default Home;
