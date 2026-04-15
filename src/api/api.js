const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

async function fetchFromAPI(url) {
  try {
    // Route through our caching API proxy
    const proxyUrl = url.replace(BASE_URL, "/api/tmdb");
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

function mapMovie(item, forceMediaType) {
  const mediaType = forceMediaType || item.media_type || "movie";
  const isTV = mediaType === "tv";
  return {
    id: item.id,
    title: isTV ? item.name || item.title : item.title || item.name,
    year: isTV
      ? item.first_air_date?.split("-")[0]
      : item.release_date?.split("-")[0],
    image: item.poster_path ? `${IMG_BASE}/w500${item.poster_path}` : null,
    backdrop: item.backdrop_path
      ? `${IMG_BASE}/original${item.backdrop_path}`
      : null,
    backdropMd: item.backdrop_path
      ? `${IMG_BASE}/w780${item.backdrop_path}`
      : null,
    overview: item.overview || "",
    mediaType,
    popularity: item.popularity,
    voteAverage: item.vote_average,
    genreIds: item.genre_ids || [],
  };
}

export async function fetchTrending() {
  const data = await fetchFromAPI(
    `${BASE_URL}/trending/all/week?language=en-US`,
  );
  if (!data?.results) return [];
  return data.results
    .filter((item) => item.media_type !== "person")
    .map((item) => mapMovie(item));
}

export async function fetchPopularMovies() {
  const data = await fetchFromAPI(
    `${BASE_URL}/movie/popular?language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, "movie"));
}

export async function fetchTopRated() {
  const data = await fetchFromAPI(
    `${BASE_URL}/movie/top_rated?language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, "movie"));
}

export async function fetchNowPlaying() {
  const data = await fetchFromAPI(
    `${BASE_URL}/movie/now_playing?language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, "movie"));
}

export async function fetchUpcoming() {
  const data = await fetchFromAPI(
    `${BASE_URL}/movie/upcoming?language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, "movie"));
}

export async function fetchPopularTV() {
  const data = await fetchFromAPI(
    `${BASE_URL}/tv/popular?language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, "tv"));
}

export async function fetchByGenre(genreId, mediaType = "movie") {
  const data = await fetchFromAPI(
    `${BASE_URL}/discover/${mediaType}?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`,
  );
  if (!data?.results) return [];
  return data.results.map((item) => mapMovie(item, mediaType));
}

export async function searchMovies(query) {
  const data = await fetchFromAPI(
    `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
  );
  if (!data?.results) return [];
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => mapMovie(item));
}

const DETAILS_CACHE_PREFIX = "wd:";

export function getCachedDetails(id, mediaType = "movie") {
  try {
    const raw = sessionStorage.getItem(`${DETAILS_CACHE_PREFIX}${mediaType}-${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cacheDetails(id, mediaType, details) {
  try {
    sessionStorage.setItem(
      `${DETAILS_CACHE_PREFIX}${mediaType}-${id}`,
      JSON.stringify(details),
    );
  } catch { /* quota exceeded — silently skip */ }
}

export async function fetchMovieDetails(id, mediaType = "movie") {
  const cached = getCachedDetails(id, mediaType);
  if (cached) return cached;

  const data = await fetchFromAPI(
    `${BASE_URL}/${mediaType}/${id}?append_to_response=credits,similar,videos&language=en-US`,
  );
  if (!data) return null;

  const cast = data.credits?.cast?.slice(0, 15).map((c) => c.name) || [];
  const director =
    data.credits?.crew?.find((c) => c.job === "Director")?.name || "";
  const genres = data.genres?.map((g) => g.name) || [];
  const trailer = data.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );
  const similar = (data.similar?.results || [])
    .slice(0, 12)
    .map((item) => mapMovie(item, mediaType));

  return {
    id: data.id,
    title: mediaType === "tv" ? data.name : data.title,
    year:
      mediaType === "tv"
        ? data.first_air_date?.split("-")[0]
        : data.release_date?.split("-")[0],
    image: data.poster_path ? `${IMG_BASE}/w500${data.poster_path}` : null,
    backdrop: data.backdrop_path
      ? `${IMG_BASE}/original${data.backdrop_path}`
      : null,
    overview: data.overview || "",
    mediaType,
    voteAverage: data.vote_average,
    runtime: mediaType === "tv" ? data.episode_run_time?.[0] : data.runtime,
    numberOfSeasons: data.number_of_seasons,
    genres,
    cast,
    director,
    similar,
    trailerKey: trailer?.key || null,
    tagline: data.tagline || "",
  };

  cacheDetails(id, mediaType, result);
  return result;
}

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
