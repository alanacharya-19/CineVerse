import type { Movie } from "../types/movie";

const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
  release_date: string;
  overview: string;
};

type TMDBPage<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

type TMDBGenre = { id: number; name: string };
type TMDBGenresList = { genres: TMDBGenre[] };

type TMDBCastMember = {
  name: string;
  character: string;
  profile_path: string | null;
};

type TMDBCredits = {
  crew: { name: string; job: string; profile_path: string | null }[];
};

type TMDBMovieDetail = {
  runtime: number | null;
  budget: number;
  revenue: number;
  credits: TMDBCredits;
};

let genreCache: Map<number, string> | null = null;

async function getGenres(): Promise<Map<number, string>> {
  if (genreCache) return genreCache;
  const data = await fetchJson<TMDBGenresList>(`${BASE}/genre/movie/list?language=en-US`);
  genreCache = new Map(data.genres.map((g) => [g.id, g.name]));
  return genreCache;
}

function poster(path: string | null) {
  return path
    ? IMG + path
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
}

async function mapMovie(m: TMDBMovie) {
  const genres = await getGenres();
  return {
    id: m.id,
    title: m.title,
    poster_path: poster(m.poster_path),
    backdrop_path: poster(m.backdrop_path),
    rating: Math.round(m.vote_average * 10) / 10,
    genre: m.genre_ids.map((id) => genres.get(id) ?? "Unknown").join(", "),
    duration: "",
    releaseDate: m.release_date || "TBA",
    description: m.overview || "No description available.",
  };
}

// ─── Public API ───

const LANGUAGES = ["en", "hi", "te", "ta", "ml", "kn", "bn", "mr"];

async function fetchMultiLang(endpoint: string, mapFn: (m: TMDBMovie) => Promise<Movie>): Promise<Movie[]> {
  const results = await Promise.all(
    LANGUAGES.map((lang) =>
      fetchJson<TMDBPage<TMDBMovie>>(
        `${BASE}${endpoint}&with_original_language=${lang}`
      ).then((d) => d.results)
    )
  );
  const seen = new Set<number>();
  const merged: TMDBMovie[] = [];
  for (const batch of results) {
    for (const m of batch) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        merged.push(m);
      }
    }
  }
  return Promise.all(merged.map(mapFn));
}

export async function fetchTrending() {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/trending/movie/week?language=en-US`
  );
  return Promise.all(data.results.slice(0, 10).map(mapMovie));
}

export async function fetchPopular(): Promise<Movie[]> {
  return fetchMultiLang("/discover/movie?sort_by=popularity.desc&language=en-US", mapMovie);
}

export async function fetchNowPlaying() {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/movie/now_playing?language=en-US&page=1`
  );
  const movies = await Promise.all(data.results.map(mapMovie));
  const ids = new Set(movies.map((m) => m.id));
  const extra = await fetchMultiLang(
    `/discover/movie?sort_by=popularity.desc&language=en-US&release_date.lte=${new Date().toISOString().slice(0, 10)}`,
    mapMovie
  );
  return [...movies, ...extra.filter((m) => !ids.has(m.id))];
}

export async function fetchUpcoming(): Promise<Movie[]> {
  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date();
  todayDate.setHours(23, 59, 59, 999);
  return fetchMultiLang(
    `/discover/movie?sort_by=release_date.asc&language=en-US&release_date.gte=${today}`,
    mapMovie
  ).then((movies) => movies.filter((m) => m.releaseDate && new Date(m.releaseDate) > todayDate));
}

export async function searchMovies(query: string) {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`
  );
  return Promise.all(data.results.map(mapMovie));
}

export async function fetchMovieCredits(movieId: number) {
  const data = await fetchJson<TMDBCredits>(
    `${BASE}/movie/${movieId}/credits?language=en-US`
  );
  const director =
    data.crew.find((c) => c.job === "Director")?.name ?? "Unknown";
  const writer =
    data.crew.find((c) => c.job === "Screenplay")?.name ??
    data.crew.find((c) => c.job === "Writer")?.name ??
    "Unknown";
  const dirImage = data.crew.find((c) => c.job === "Director")?.profile_path;
  const wrImage =
    data.crew.find((c) => c.job === "Screenplay")?.profile_path ??
    data.crew.find((c) => c.job === "Writer")?.profile_path;
  return {
    director,
    writer,
    directorImage: poster(dirImage ?? null),
    writerImage: poster(wrImage ?? null),
  };
}

export async function fetchMovieRuntime(movieId: number) {
  const data = await fetchJson<TMDBMovieDetail>(
    `${BASE}/movie/${movieId}?language=en-US`
  );
  const hours = Math.floor((data.runtime ?? 0) / 60);
  const mins = (data.runtime ?? 0) % 60;
  return {
    duration: data.runtime ? `${hours}h ${mins}min` : "N/A",
    budget: data.budget ? `$${(data.budget / 1_000_000).toFixed(0)}M` : "N/A",
    boxOffice: data.revenue ? `$${(data.revenue / 1_000_000).toFixed(0)}M` : "N/A",
  };
}

export async function fetchMovieDetails(movieId: number) {
  const [credits, runtime, details] = await Promise.all([
    fetchMovieCredits(movieId),
    fetchMovieRuntime(movieId),
    fetchJson<TMDBMovie>(`${BASE}/movie/${movieId}?language=en-US`),
  ]);
  return { ...credits, ...runtime };
}

export async function fetchSimilarMovies(movieId: number): Promise<Movie[]> {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/movie/${movieId}/recommendations?language=en-US&page=1`
  );
  if (data.results.length === 0) {
    const fallback = await fetchJson<TMDBPage<TMDBMovie>>(
      `${BASE}/movie/${movieId}/similar?language=en-US&page=1`
    );
    return Promise.all(fallback.results.slice(0, 6).map(mapMovie));
  }
  return Promise.all(data.results.slice(0, 6).map(mapMovie));
}
