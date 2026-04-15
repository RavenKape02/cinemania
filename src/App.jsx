import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./views/Home/Home.jsx";
import Favorites from "./views/Favorites/Favorites.jsx";
import MovieModal from "./components/MovieModal/MovieModal.jsx";
import { searchMovies, fetchMovieDetails, getCachedDetails } from "./api/api.js";

function App() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [modalMovie, setModalMovie] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalSourceRect, setModalSourceRect] = useState(null);
  const modalKeyRef = useRef(0);
  const searchTimeoutRef = useRef(null);
  const pendingClickRef = useRef(0);

  const favoritesSet = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites],
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === movie.id)
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie],
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

  const openModal = useCallback((movie, details, rect) => {
    modalKeyRef.current += 1;
    setModalDetails(details);
    setModalSourceRect(rect || null);
    setModalMovie(movie);
  }, []);

  const handleMovieClick = useCallback((movie, rect) => {
    const clickId = ++pendingClickRef.current;
    const mediaType = movie.mediaType || "movie";
    const cached = getCachedDetails(movie.id, mediaType);

    if (cached) {
      openModal(movie, cached, rect);
      return;
    }

    fetchMovieDetails(movie.id, mediaType).then((data) => {
      if (pendingClickRef.current !== clickId) return;
      openModal(movie, data, rect);
    });
  }, [openModal]);

  const handleCloseModal = useCallback(() => {
    setModalMovie(null);
    setModalDetails(null);
    setModalSourceRect(null);
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
                favoritesSet={favoritesSet}
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

        <AnimatePresence>
          {modalMovie && (
            <MovieModal
              key={`modal-${modalKeyRef.current}`}
              movie={modalMovie}
              details={modalDetails}
              sourceRect={modalSourceRect}
              isOpen={!!modalMovie}
              onClose={handleCloseModal}
              isFavorite={favoritesSet.has(modalMovie.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </AnimatePresence>

        <Analytics />
        <SpeedInsights />
      </div>
    </BrowserRouter>
  );
}

export default App;
