import { Heart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  categories?: string[];
  pageCount?: number;
}

interface BookCardProps {
  book: Book;
  onToggleFavorite?: (bookId: string) => void;
  isFavorite?: boolean;
}

export default function BookCard({ book, onToggleFavorite, isFavorite = false }: BookCardProps) {
  const thumbnail = book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail;
  const authors = book.authors?.slice(0, 2).join(", ") || "Unknown Author";
  const category = book.categories?.[0] || "";
  const year = book.publishedDate ? new Date(book.publishedDate).getFullYear() : "";

  return (
    <div className="book-card group p-4 rounded-lg border bg-card relative overflow-hidden">
      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={() => onToggleFavorite?.(book.id)}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-foreground"
          }`}
        />
      </Button>

      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="w-20 h-28 bg-muted rounded border overflow-hidden shadow-sm">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={book.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-library-cream to-library-parchment flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center px-1 font-display">
                  {book.title.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-display font-semibold text-sm leading-tight line-clamp-2 text-foreground">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-xs text-muted-foreground font-reading">
              by {authors}
            </p>

            {/* Rating & Year */}
            <div className="flex items-center gap-2 text-xs">
              {book.averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-library-gold text-library-gold" />
                  <span className="text-foreground font-medium">
                    {book.averageRating.toFixed(1)}
                  </span>
                  {book.ratingsCount && (
                    <span className="text-muted-foreground">
                      ({book.ratingsCount})
                    </span>
                  )}
                </div>
              )}
              {year && (
                <span className="text-muted-foreground">• {year}</span>
              )}
            </div>

            {/* Category & Pages */}
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                  {category}
                </Badge>
              )}
              {book.pageCount && (
                <span className="text-xs text-muted-foreground">
                  {book.pageCount} pages
                </span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-reading">
                {book.description.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}