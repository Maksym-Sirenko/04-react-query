import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import fetchMovies from "../../services/movieService";
import { notifyEmpty } from "../../services/notifications";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  });

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  //

  const handleSearch = async (topic: string) => {
    setQuery(topic);
    setCurrentPage(1);
  };

  const openModal = (film: Movie) => {
    setSelectedMovie(film);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  if (isSuccess && movies.length === 0) {
    notifyEmpty();
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}

      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
};

export default App;
