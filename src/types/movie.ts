export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  rating: number;
  genre: string;
  duration: string;
  releaseDate: string;
  description: string;
};

export type TVShow = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  rating: number;
  genre: string;
  seasons: string;
  episodes: string;
  releaseDate: string;
  description: string;
};

export type CastMember = {
  name: string;
  role: string;
  image: string;
};

export type MovieDetails = {
  director: string;
  writer: string;
  directorImage: string;
  writerImage: string;
  budget: string;
  boxOffice: string;
};

export type TVDetails = {
  creator: string;
  seasons: number;
  episodes: number;
  status: string;
  creatorImage: string;
};
