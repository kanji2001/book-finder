import { useState, useCallback } from "react";

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

interface BookSearchResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
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
    };
  }>;
  totalItems: number;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchBooks = useCallback(async (query: string, startIndex = 0) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=20&printType=books&projection=full`
      );

      if (!response.ok) {
        throw new Error("Failed to search books");
      }

      const data: BookSearchResponse = await response.json();

      if (data.items) {
        const formattedBooks: Book[] = data.items.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || [],
          publishedDate: item.volumeInfo.publishedDate,
          description: item.volumeInfo.description,
          imageLinks: item.volumeInfo.imageLinks,
          averageRating: item.volumeInfo.averageRating,
          ratingsCount: item.volumeInfo.ratingsCount,
          categories: item.volumeInfo.categories,
          pageCount: item.volumeInfo.pageCount,
        }));

        if (startIndex === 0) {
          setBooks(formattedBooks);
        } else {
          setBooks((prev) => [...prev, ...formattedBooks]);
        }
      } else {
        if (startIndex === 0) {
          setBooks([]);
        }
      }

      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      if (startIndex === 0) {
        setBooks([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreBooks = useCallback(
    (query: string) => {
      if (!isLoading && books.length > 0) {
        searchBooks(query, books.length);
      }
    },
    [books.length, isLoading, searchBooks]
  );

  return {
    books,
    isLoading,
    error,
    hasSearched,
    searchBooks,
    loadMoreBooks,
  };
}