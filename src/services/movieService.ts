import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<FetchMoviesResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query: query,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      },
    );

    return response.data?.results ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
