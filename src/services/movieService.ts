import axios from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const movieService = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const API_ENDPOINTS = {
  SEARCH: "/search/movie",
  DISCOVER: "/discover/movie",
  FIND: "/find",
};

interface ResponseHttpMovies {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

interface ResponseDataMovies {
  results: Movie[];
  total_pages: number;
  total_results: number;
  pageData: number;
}

const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<ResponseDataMovies> => {
  const { data } = await movieService.get<ResponseHttpMovies>(
    API_ENDPOINTS.SEARCH,
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
    }
  );

  return {
    results: data.results,
    total_pages: data.total_pages,
    total_results: data.total_results,
    pageData: data.page,
  };
};

export default fetchMovies;
