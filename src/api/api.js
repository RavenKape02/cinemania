const API_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.MOVIEDB_API_KEY}`
  }
};

export const fetchMovies = async () => {
  try {
    const response = await fetch(API_URL, API_OPTIONS);
    const data = await response.json();
    console.log('Full API Response:', data);
    
    // Extract and transform the movie data
    const movies = data.results.map(movie => ({
      title: movie.title,
      year: movie.release_date.split('-')[0],
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      id: movie.id
    }));
    
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
};

