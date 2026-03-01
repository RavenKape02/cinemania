import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function MovieCard(props) {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={props.image}
          alt={props.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Button
          size="icon"
          variant="secondary"
          className={`absolute top-3 right-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
            props.isFavorite
              ? "bg-red-500 hover:bg-red-600 text-white scale-110"
              : ""
          }`}
          onClick={props.onToggleFavorite}
        >
          <svg
            className="w-5 h-5"
            fill={props.isFavorite ? "currentColor" : "none"}
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
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="w-full backdrop-blur-md"
            onClick={() => window.open(props.link, "_blank")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Watch Now
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {props.title}
        </h3>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
            </svg>
            {props.year}
          </Badge>
          <div className="flex items-center gap-1 text-yellow-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-xs font-medium text-foreground">
              {props.rating}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
