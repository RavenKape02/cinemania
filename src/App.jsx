import './App.css'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import MovieCard from './components/MovieCard/MovieCard.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'
import { Routes, Route } from 'react-router-dom';
import { fetchMovies } from './api/api.js';

function App() {
  const [movieData, setMovieData] = useState([]);
  const [text, setText] = useState('');
  const [favorites, setFavorites] = useState([]);
  
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const toggleFavorite = (movie) => {
    setFavorites(prev => 
      prev.some(fav => fav.title === movie.title)
        ? prev.filter(fav => fav.title !== movie.title)
        : [...prev, movie]
    );
  };

  useEffect(() => {
    const getMovies = async () => {
      const movies = await fetchMovies();
      setMovieData(movies);
    };
    getMovies();
  }, []); 

  return (
    <>
      <div className="Header">
        <Navbar />
        <div className="search-container">
          <input 
            type="text" 
            value={text} 
            onChange={handleChange} 
            placeholder="Search movies..."
            className="search-input"
          />
        </div>
      </div>

      <Routes> 
        <Route path='/' element={
          <div className="movie-grid">
            {movieData
              .filter(movie => movie.title.toLowerCase().includes(text.toLowerCase()))
              .map(movie => (
                <MovieCard 
                  key={movie.title}
                  image={movie.image} 
                  title={movie.title} 
                  year={movie.year}
                  isFavorite={favorites.some(fav => fav.title === movie.title)}
                  onToggleFavorite={() => toggleFavorite(movie)}
                />
              ))
            }
          </div>
        } />
        <Route path='/favorites' element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} searchText={text} />} />
      </Routes>
    </>
  )
}

export default App