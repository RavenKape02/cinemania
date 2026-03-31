import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./views/Home/Home.jsx";
import Favorites from "./views/Favorites/Favorites.jsx";
import MovieModal from "./components/MovieModal/MovieModal.jsx";
import { searchMovies } from "./api/api.js";

function App() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [modalMovie, setModalMovie] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === movie.id)
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie]
    );
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchText(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchMovies(value);
      setSearchResults(results || []);
    }, 300);
  }, []);

  const handleMovieClick = useCallback((movie) => {
    setModalMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalMovie(null);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-netflix-black">
        <Navbar onSearch={handleSearch} searchText={searchText} />

        <Routes>
        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onMovieClick={handleMovieClick}
              searchText={searchText}
              searchResults={searchResults}
              isSearching={isSearching}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onMovieClick={handleMovieClick}
            />
          }
        />
      </Routes>

      <MovieModal
        movie={modalMovie}
        isOpen={!!modalMovie}
        onClose={handleCloseModal}
        isFavorite={
          modalMovie
            ? favorites.some((fav) => fav.id === modalMovie.id)
            : false
        }
        onToggleFavorite={toggleFavorite}
      />

        <Analytics />
        <SpeedInsights /> 
      </div>
    </BrowserRouter>
  );
}

export default App;
