import { useState } from "react";
import { Toaster } from "react-hot-toast";

import fetchMovies from "../../services/movieService";
import { notifyEmpty } from "../../services/notifications";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import LoadMore from "../LoadMore/LoadMore";

const App = () => {
  const [query, setQuery] = useState("");

  const [morePages, setMorePages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState<Movie[]>([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (topic: string) => {
    try {
      setLoading(true);
      setError(false);
      setMovies([]);
      setCurrentPage(1);

      const { results, total_pages } = await fetchMovies(topic, currentPage);
      setQuery(topic);

      setMorePages(currentPage < total_pages);
      if (results.length === 0) {
        notifyEmpty();
        setMovies([]);
      } else setMovies(results);
    } catch {
      setError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreClick = async () => {
    if (!query) return;
    const nextPage = currentPage + 1;

    try {
      setLoading(true);
      setError(false);

      const { results, total_pages } = await fetchMovies(query, nextPage);
      if (results && results.length > 0) {
        setMovies((prev) => [...prev, ...results]);
        setCurrentPage(nextPage);
        setMorePages(nextPage < (total_pages ?? nextPage));
      } else {
        setMorePages(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (film: Movie) => {
    setSelectedMovie(film);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}

      {loading && <Loader />}

      {morePages && !loading && <LoadMore handleClick={handleLoadMoreClick} />}

      {error && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}

      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
};

export default App;
