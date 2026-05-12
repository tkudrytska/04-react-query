import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data = [], isLoading, isError } = useQuery<Movie[]>({
    queryKey: ["movie", query],
    queryFn: () => fetchMovies(query),
    enabled: !!query,
  });

  useEffect(() => {
  if (query && data.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [data, query]);

  const handleSearch = (value: string) => {
    setQuery(value);
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
      {data.length > 0 && <MovieGrid movies={data} onSelect={openModal} />}
      {modal && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
