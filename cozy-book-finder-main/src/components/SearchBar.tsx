import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search for books, authors, or genres...",
  isLoading = false 
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="search-glow relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-library-gold focus:ring-library-gold/20 font-reading rounded-xl"
          disabled={isLoading}
        />

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          onClick={onSearch}
          disabled={!value.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-library-brown hover:bg-library-warm text-library-cream font-reading rounded-lg transition-all duration-200"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-library-cream border-t-transparent rounded-full" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Search suggestions could go here */}
    </div>
  );
}