import axios from "axios";
import type { Movie } from "../types/movie";

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResponse> => {
  try {
    const response = await axios.get<FetchMoviesResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query,
          include_adult: false,
          language: "en-US",
          page,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      results: [],
      total_pages: 0,
    };
  }
};
