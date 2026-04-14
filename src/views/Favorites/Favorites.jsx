import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import MovieCard from "@/components/MovieCard/MovieCard";

function Favorites({ favorites, toggleFavorite, onMovieClick }) {
  return (
    <div className="min-h-screen bg-netflix-black pt-20 md:pt-24 px-4 md:px-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          My List
        </h1>
        {favorites.length > 0 && (
          <p className="text-netflix-light-gray text-sm">
            {favorites.length} title{favorites.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 pb-12">
          {favorites.map((movie, index) => (
            <Motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.8) }}
            >
              <MovieCard
                movie={movie}
                rowId="favorites"
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onClick={onMovieClick}
              />
            </Motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Heart size={36} className="text-netflix-gray" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Your list is empty
          </h2>
          <p className="text-netflix-gray text-sm text-center max-w-sm mb-8">
            Add movies and shows to your list so you can easily find them later.
          </p>
          <Link
            to="/"
            className="bg-white text-black font-bold px-8 py-3 rounded text-sm hover:bg-white/80 transition-colors"
          >
            Browse Content
          </Link>
        </div>
      )}
    </div>
  );
}

export default Favorites;
