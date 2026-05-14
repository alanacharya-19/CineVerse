export type Movie = {
  id: number;
  title?: string;
  poster_path?: string;
  rating?: number;
};

export const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    poster_path:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 8.5,
  },
  {
    id: 2,
    title: "Interstellar",
    poster_path:
      "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    rating: 7.8,
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 6.9,
  },
  {
    id: 4,
    title: "Tenet",
    poster_path:
      "https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
    rating: 9.9,
  },
  {
    id: 5,
    title: "Dunkirk",
    poster_path:
      "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
    rating: 5.4,
  },

  {
    id: 6,
    title: "Avatar",
    poster_path:
      "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    rating: 7.1,
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    poster_path:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    rating: 3.2,
  },
];
