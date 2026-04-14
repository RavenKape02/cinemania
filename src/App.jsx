import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./views/Home/Home.jsx";
import Favorites from "./views/Favorites/Favorites.jsx";
import { searchMovies } from "./api/api.js";

const MovieModal = lazy(() => import("./components/MovieModal/MovieModal.jsx"));

function App() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [modalMovie, setModalMovie] = useState(null);
  const [modalLayoutId, setModalLayoutId] = useState(null);
  const searchTimeoutRef = useRef(null);

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

  const handleMovieClick = useCallback((movie, layoutId) => {
    setModalMovie(movie);
    setModalLayoutId(layoutId || null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalMovie(null);
    setModalLayoutId(null);
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
      <LayoutGroup>
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

          <AnimatePresence initial={false}>
            {modalMovie && (
              <Suspense fallback={null}>
                <MovieModal
                  key={
                    modalLayoutId ||
                    `${modalMovie.mediaType || "movie"}-${modalMovie.id}`
                  }
                  movie={modalMovie}
                  isOpen={!!modalMovie}
                  onClose={handleCloseModal}
                  isFavorite={favoritesSet.has(modalMovie.id)}
                  onToggleFavorite={toggleFavorite}
                  layoutId={modalLayoutId}
                />
              </Suspense>
            )}
          </AnimatePresence>

          <Analytics />
          <SpeedInsights />
        </div>
      </LayoutGroup>
    </BrowserRouter>
  );
}

export default App;
