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

export type CastMember = {
  name: string;
  role: string;
  image: string;
};

export type MovieDetails = {
  director: string;
  writer: string;
  budget: string;
  boxOffice: string;
};
