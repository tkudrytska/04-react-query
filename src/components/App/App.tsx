import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import type { Movie, FetchMoviesResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<FetchMoviesResponse>({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [movies.length, query, isLoading, isError]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {modal && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
