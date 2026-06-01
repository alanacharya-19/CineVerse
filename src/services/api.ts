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

async function fetchInterleaved(endpoint: string): Promise<Movie[]> {
  const results = await Promise.all(
    LANGUAGES.map((lang) =>
      fetchJson<TMDBPage<TMDBMovie>>(
        `${BASE}${endpoint}&with_original_language=${lang}`
      ).then((d) => d.results)
    )
  );
  const seen = new Set<number>();
  const merged: TMDBMovie[] = [];
  let maxLen = Math.max(...results.map((r) => r.length));
  for (let i = 0; i < maxLen; i++) {
    for (const batch of results) {
      if (i < batch.length && !seen.has(batch[i].id)) {
        seen.add(batch[i].id);
        merged.push(batch[i]);
      }
    }
  }
  return Promise.all(merged.map(mapMovie));
}

export async function fetchTrending() {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/trending/movie/week?language=en-US`
  );
  return Promise.all(data.results.slice(0, 10).map(mapMovie));
}

export async function fetchPopular(page = 1): Promise<Movie[]> {
  const year = new Date().getFullYear();
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/discover/movie?sort_by=popularity.desc&primary_release_year=${year}&language=en-US&page=${page}`
  );
  if (page > 1) return Promise.all(data.results.map(mapMovie));
  const base = await Promise.all(data.results.map(mapMovie));
  const extra = await fetchInterleaved(
    `/discover/movie?sort_by=popularity.desc&primary_release_year=${year}&language=en-US`
  );
  const seen = new Set(base.map((m) => m.id));
  return [...base, ...extra.filter((m) => !seen.has(m.id))];
}

export async function fetchNowPlaying(page = 1) {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/movie/now_playing?language=en-US&page=${page}`
  );
  return Promise.all(data.results.map(mapMovie));
}

export async function fetchUpcoming(page = 1): Promise<Movie[]> {
  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date();
  todayDate.setHours(23, 59, 59, 999);
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/discover/movie?sort_by=release_date.asc&language=en-US&release_date.gte=${today}&page=${page}`
  );
  if (page > 1) return Promise.all(data.results.filter((m) => new Date(m.release_date) > todayDate).map(mapMovie));
  const base = await Promise.all(data.results.map(mapMovie));
  const extra = await fetchInterleaved(
    `/discover/movie?sort_by=release_date.asc&language=en-US&release_date.gte=${today}`
  );
  const seen = new Set(base.map((m) => m.id));
  const all = [...base, ...extra.filter((m) => !seen.has(m.id))];
  return all.filter((m) => m.releaseDate && new Date(m.releaseDate) > todayDate);
}

export async function searchMovies(query: string, page = 1) {
  const data = await fetchJson<TMDBPage<TMDBMovie>>(
    `${BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
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

// ─── TV Shows ───

type TMDBTVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
  first_air_date: string;
  overview: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  created_by?: { name: string; profile_path: string | null }[];
};

async function mapTVShow(t: TMDBTVShow) {
  const genres = await getGenres();
  return {
    id: t.id,
    title: t.name,
    poster_path: poster(t.poster_path),
    backdrop_path: poster(t.backdrop_path),
    rating: Math.round(t.vote_average * 10) / 10,
    genre: t.genre_ids.map((id) => genres.get(id) ?? "Unknown").join(", "),
    seasons: t.number_of_seasons ? `${t.number_of_seasons}` : "N/A",
    episodes: t.number_of_episodes ? `${t.number_of_episodes}` : "N/A",
    releaseDate: t.first_air_date || "TBA",
    description: t.overview || "No description available.",
  };
}

export async function fetchTrendingTV(page = 1) {
  const data = await fetchJson<TMDBPage<TMDBTVShow>>(
    `${BASE}/trending/tv/week?language=en-US&page=${page}`
  );
  return Promise.all(data.results.map(mapTVShow));
}

export async function fetchTVDetails(tvId: number) {
  const data = await fetchJson<TMDBTVShow & { credits: TMDBCredits }>(
    `${BASE}/tv/${tvId}?language=en-US`
  );
  const creator = data.created_by?.[0]?.name ?? "Unknown";
  const creatorImage = poster(data.created_by?.[0]?.profile_path ?? null);
  return {
    creator,
    creatorImage,
    seasons: data.number_of_seasons ?? 0,
    episodes: data.number_of_episodes ?? 0,
    status: data.status ?? "N/A",
  };
}

export async function fetchSimilarTV(tvId: number) {
  const data = await fetchJson<TMDBPage<TMDBTVShow>>(
    `${BASE}/tv/${tvId}/recommendations?language=en-US&page=1`
  );
  if (data.results.length === 0) {
    const fallback = await fetchJson<TMDBPage<TMDBTVShow>>(
      `${BASE}/tv/${tvId}/similar?language=en-US&page=1`
    );
    return Promise.all(fallback.results.slice(0, 6).map(mapTVShow));
  }
  return Promise.all(data.results.slice(0, 6).map(mapTVShow));
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
