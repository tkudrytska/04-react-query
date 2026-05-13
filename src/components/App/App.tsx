import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import {
  fetchMovies,
  type FetchMoviesResponse,
} from "../../services/movieService";
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

  const { data, isError, isFetching, isSuccess } =
    useQuery<FetchMoviesResponse>({
      queryKey: ["movie", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: !!query,
      placeholderData: keepPreviousData,
    });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && isSuccess && !isFetching && movies.length === 0) {
      toast.dismiss();
      toast.error("No movies found for your request.");
    }
  }, [movies.length, query, isSuccess, isFetching]);

  useEffect(() => {
    if (movies.length > 0) {
      toast.dismiss();
    }
  }, [movies.length]);

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
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && movies.length === 0 && <p>No results</p>}
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          forcePage={page - 1}
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
