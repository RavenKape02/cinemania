const API_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_API_KEY}`,
  },
};

export const fetchMovies = async () => {
  try {
    const response = await fetch(API_URL, API_OPTIONS);
    const data = await response.json();
    console.log("Full API Response:", data);

    // Extract and transform the movie data
    const movies = data.results.map((movie) => ({
      title: movie.title,
      year: movie.release_date.split("-")[0],
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      id: movie.id,
      popularity: movie.popularity,
    }));

    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

export const searchMovies = async (query) => {
  const SEARCH_API_URL = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
  try {
    const response = await fetch(SEARCH_API_URL, API_OPTIONS);
    const data = await response.json();
    console.log("Full Search API Response:", data);
    // Extract and transform the movie and TV show data
    const results = data.results
      .filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.media_type !== "person",
      )
      .map((item) => ({
        title: item.media_type === "movie" ? item.title : item.name,
        year:
          item.media_type === "movie"
            ? item.release_date?.split("-")[0]
            : item.first_air_date?.split("-")[0],
        image: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
        id: item.id,
        mediaType: item.media_type,
        popularity: item.popularity,
      }));
    return results;
  } catch (error) {
    console.error("Error searching movies and TV shows:", error);
    return null;
  }
};
