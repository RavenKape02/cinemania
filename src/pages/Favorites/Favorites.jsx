import MovieCard from '../../components/MovieCard/MovieCard.jsx';

function Favorites(props) {
  return (
    <div className="movie-grid">
      {props.favorites
        .filter(movie => movie.title.toLowerCase().includes(props.searchText.toLowerCase()))
        .map(movie => (
          <MovieCard 
            key={movie.title}
            image={movie.image} 
            title={movie.title} 
            year={movie.year}
            isFavorite={true}
            onToggleFavorite={() => props.toggleFavorite(movie)}
          />
        ))
      }
    </div>
  );
}
export default Favorites;