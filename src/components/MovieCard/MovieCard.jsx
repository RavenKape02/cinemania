import './MovieCard.css';


function MovieCard(props) {
  return (
    <div className="movie-card">
      <img src={props.image} alt={props.title} className="movie-card-image" />
      <button 
        className={`favorite-btn ${props.isFavorite ? 'active' : ''}`}
        onClick={props.onToggleFavorite}
        aria-label="Add to favorites"
      >
        ♥
      </button>
      <div className="movie-card-content">
        <h2 className="movie-card-title">{props.title}</h2>
        <p className="movie-card-year">{props.year}</p>
      </div>
    </div>
  );
}

export default MovieCard;