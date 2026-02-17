import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

function Favorites(props) {
  const filteredFavorites = props.favorites.filter((movie) =>
    movie.title.toLowerCase().includes(props.searchText.toLowerCase()),
  );

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Favorites
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {props.favorites.length}{" "}
                {props.favorites.length === 1 ? "favorite" : "favorites"}
              </Badge>
              {props.searchText && (
                <>
                  <span>•</span>
                  <Badge variant="outline">
                    {filteredFavorites.length} matching search
                  </Badge>
                </>
              )}
            </p>
          </div>
        </div>
        <Separator />
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFavorites.map((movie) => (
            <MovieCard
              key={movie.id}
              image={movie.image}
              title={movie.title}
              year={movie.year}
              link={`https://www.vidking.net/embed/movie/${movie.id}`}
              isFavorite={true}
              onToggleFavorite={() => props.toggleFavorite(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 mb-6">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">
            {props.favorites.length === 0
              ? "No favorites yet"
              : "No matching favorites"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {props.favorites.length === 0
              ? "Start building your collection by clicking the heart icon on any movie"
              : "Try adjusting your search to find your favorite movies"}
          </p>
          {props.favorites.length === 0 && (
            <Link to="/">
              <Button size="lg" className="gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Discover Movies
              </Button>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
export default Favorites;
