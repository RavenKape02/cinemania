import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import MovieCard from "./components/MovieCard/MovieCard.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";
import { Routes, Route } from "react-router-dom";
import { fetchMovies, searchMovies } from "./api/api.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const [movieData, setMovieData] = useState([]);
  const [text, setText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = async (e) => {
    setText(e.target.value);
    if (e.target.value === "") {
      console.log("Search input cleared, fetching default movies");
      setIsSearching(false);
      const movies = await fetchMovies();
      setMovieData(movies);
    } else {
      console.log("Searching for:", e.target.value);
      setIsSearching(true);
      const movieResults = await searchMovies(e.target.value);
      setMovieData(movieResults);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.title === movie.title)
        ? prev.filter((fav) => fav.title !== movie.title)
        : [...prev, movie],
    );
  };

  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true);
      const movies = await fetchMovies();
      setMovieData(movies);
      setIsLoading(false);
    };
    getMovies();
  }, []);

  const filteredMovies = (movieData || []).slice().sort((a, b) => {
    // Sort by popularity (descending)
    return (b.popularity || 0) - (a.popularity || 0);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <main className="container mx-auto px-6 py-8">
              <div className="mb-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-1">
                      Relax ka lang, nandito lahat ng gusto mong panoorin
                    </h1>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Badge variant="secondary">
                        {movieData.length} movies available
                      </Badge>
                      <span>•</span>
                      <Badge variant="outline">
                        {favorites.length} favorites
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <Input
                      type="text"
                      value={text}
                      onChange={handleChange}
                      placeholder="Search for movies, actors, directors..."
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>

                <Separator />
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-[450px] w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : filteredMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      image={movie.image}
                      title={movie.title}
                      year={movie.year}
                      link={
                        movie.mediaType === "tv"
                          ? `https://www.vidking.net/embed/tv/${movie.id}/1/1?nextEpisode=true&episodeSelector=true`
                          : `https://www.vidking.net/embed/movie/${movie.id}`
                      }
                      isFavorite={favorites.some(
                        (fav) => fav.title === movie.title,
                      )}
                      onToggleFavorite={() => toggleFavorite(movie)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <svg
                      className="w-10 h-10 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No movies found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </main>
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchText={text}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
