import {
  useState,
  useEffect,
  memo,
  useDeferredValue,
} from "react";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import LazyRow from "@/components/MovieRow/LazyRow";
import MovieCard from "@/components/MovieCard/MovieCard";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRated,
  fetchNowPlaying,
  fetchUpcoming,
  fetchPopularTV,
  fetchByGenre,
} from "@/api/api";

const ROW_CONFIGS = [
  { title: "Popular Movies", fetcher: fetchPopularMovies },
  { title: "Now Playing", fetcher: fetchNowPlaying },
  { title: "Top Rated", fetcher: fetchTopRated },
  { title: "Popular TV Shows", fetcher: fetchPopularTV },
  { title: "Action", fetcher: () => fetchByGenre(28) },
  { title: "Comedy", fetcher: () => fetchByGenre(35) },
  { title: "Sci-Fi", fetcher: () => fetchByGenre(878) },
  { title: "Horror", fetcher: () => fetchByGenre(27) },
  { title: "Coming Soon", fetcher: fetchUpcoming },
];

const SearchResults = memo(function SearchResults({
  searchText,
  searchResults,
  favoritesSet,
  onToggleFavorite,
}) {
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        Results for &ldquo;{searchText}&rdquo;
      </h2>
      {searchResults.length > 0 ? (
        <AnimatedGroup
          preset="blur-slide"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3"
        >
          {searchResults.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favoritesSet.has(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </AnimatedGroup>
      ) : (
        <div className="text-center py-20">
          <p className="text-netflix-light-gray text-lg">
            No results found for &ldquo;{searchText}&rdquo;
          </p>
          <p className="text-netflix-gray text-sm mt-2">
            Try different keywords or browse categories below
          </p>
        </div>
      )}
    </div>
  );
});

function Home({
  favorites,
  favoritesSet,
  onToggleFavorite,
  searchText,
  searchResults,
  isSearching,
}) {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingRow, setTrendingRow] = useState(null);
  const [heroReady, setHeroReady] = useState(false);

  const deferredSearchText = useDeferredValue(searchText);

  useEffect(() => {
    let ignore = false;

    fetchTrending().then((trending) => {
      if (ignore) return;
      const heroPool = trending.filter((m) => m.backdrop);
      if (heroPool.length > 0) {
        setHeroMovie(
          heroPool[Math.floor(Math.random() * Math.min(5, heroPool.length))],
        );
      }
      setTrendingRow(trending);
      setHeroReady(true);
    });

    return () => {
      ignore = true;
    };
  }, []);

  if (isSearching && deferredSearchText) {
    return (
      <SearchResults
        searchText={deferredSearchText}
        searchResults={searchResults}
        favoritesSet={favoritesSet}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  if (!heroReady) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <div className="h-[85vh] md:h-[90vh] bg-netflix-dark animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="px-4 md:px-12 mb-8">
            <div className="h-6 w-48 bg-white/10 rounded mb-4" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((j) => (
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
      <HeroBanner movie={heroMovie} />

      <div className="-mt-16 md:-mt-24 relative z-10">
        {trendingRow && trendingRow.length > 0 && (
          <LazyRow
            title="Trending Now"
            movies={trendingRow}
            favoritesSet={favoritesSet}
            onToggleFavorite={onToggleFavorite}
            eager
          />
        )}

        {ROW_CONFIGS.map((config) => (
          <LazyRow
            key={config.title}
            title={config.title}
            fetcher={config.fetcher}
            favoritesSet={favoritesSet}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Home);
