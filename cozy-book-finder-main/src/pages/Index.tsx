import { useState, useCallback } from "react";
import { BookOpen, Heart, Search as SearchIcon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/useBooks";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/library-hero.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { books, isLoading, error, hasSearched, searchBooks, loadMoreBooks } = useBooks();
  const { toggleFavorite, isFavorite, getFavoriteCount } = useFavorites();
  const { toast } = useToast();

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      searchBooks(searchQuery.trim());
    }
  }, [searchQuery, searchBooks]);

  const handleToggleFavorite = (bookId: string) => {
    toggleFavorite(bookId);
    const wasAdded = isFavorite(bookId);
    
    toast({
      title: wasAdded ? "Removed from favorites" : "Added to favorites",
      description: wasAdded 
        ? "Book removed from your reading list" 
        : "Book added to your reading list",
    });
  };

  const handleLoadMore = () => {
    if (searchQuery.trim()) {
      loadMoreBooks(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cozy library with warm lighting and bookshelves"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-75" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <BookOpen className="h-12 w-12 text-library-cream" />
                <h1 className="font-display text-5xl md:text-6xl font-bold text-library-cream">
                  Book Finder
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-library-cream/90 font-reading leading-relaxed">
                Your cozy personal library at your fingertips.<br />
                Discover, explore, and curate your perfect reading list.
              </p>
            </div>

            <div className="mb-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
                placeholder="Search for books, authors, or genres..."
              />
            </div>

            {getFavoriteCount() > 0 && (
              <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-4 py-2 rounded-full border border-library-cream/20">
                <Heart className="h-4 w-4 text-library-cream fill-library-cream" />
                <span className="text-library-cream font-reading text-sm">
                  {getFavoriteCount()} book{getFavoriteCount() !== 1 ? "s" : ""} in your reading list
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="container mx-auto px-4 py-12">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive font-reading">
              {error}. Please try again.
            </p>
          </div>
        )}

        {hasSearched && books.length === 0 && !isLoading && !error && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground font-reading">
              Try adjusting your search terms or exploring different genres.
            </p>
          </div>
        )}

        {books.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold mb-2">
                Search Results
              </h2>
              <p className="text-muted-foreground font-reading">
                Found {books.length} book{books.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite(book.id)}
                />
              ))}
            </div>

            {!isLoading && books.length >= 20 && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="px-8 py-2 border-library-brown text-library-brown hover:bg-library-brown hover:text-library-cream font-reading"
                >
                  Load More Books
                </Button>
              </div>
            )}

            {isLoading && books.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 text-muted-foreground font-reading">
                  <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
                  Loading more books...
                </div>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-display text-3xl font-semibold mb-4">
              Start Your Literary Journey
            </h3>
            <p className="text-lg text-muted-foreground font-reading mb-8 max-w-2xl mx-auto leading-relaxed">
              Search through millions of books to find your next great read. 
              Discover classics, explore new releases, or dive into your favorite genres.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-6 rounded-lg bg-card border">
                <SearchIcon className="h-8 w-8 text-library-gold mx-auto mb-3" />
                <h4 className="font-display font-semibold mb-2">Smart Search</h4>
                <p className="text-sm text-muted-foreground font-reading">
                  Find books by title, author, ISBN, or genre
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-card border">
                <Heart className="h-8 w-8 text-library-gold mx-auto mb-3" />
                <h4 className="font-display font-semibold mb-2">Save Favorites</h4>
                <p className="text-sm text-muted-foreground font-reading">
                  Build your personal reading list
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-card border">
                <BookOpen className="h-8 w-8 text-library-gold mx-auto mb-3" />
                <h4 className="font-display font-semibold mb-2">Rich Details</h4>
                <p className="text-sm text-muted-foreground font-reading">
                  Get ratings, reviews, and descriptions
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
