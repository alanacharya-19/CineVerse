import type { Movie, CastMember, MovieDetails } from "../src/types/movie";

export const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    poster_path:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 8.5,
    genre: "Action, Sci-Fi",
    duration: "2h 28min",
    releaseDate: "2010-07-16",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
  },
  {
    id: 2,
    title: "Interstellar",
    poster_path:
      "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    rating: 7.8,
    genre: "Adventure, Drama, Sci-Fi",
    duration: "2h 49min",
    releaseDate: "2014-11-07",
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft along with a team of researchers to find a new planet for humans.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 6.9,
    genre: "Action, Crime, Drama",
    duration: "2h 32min",
    releaseDate: "2008-07-18",
    description:
      "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    id: 4,
    title: "Tenet",
    poster_path:
      "https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
    rating: 9.9,
    genre: "Action, Sci-Fi, Thriller",
    duration: "2h 30min",
    releaseDate: "2020-09-03",
    description:
      "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
  },
  {
    id: 5,
    title: "Dunkirk",
    poster_path:
      "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
    rating: 5.4,
    genre: "Action, Drama, History",
    duration: "1h 46min",
    releaseDate: "2017-07-19",
    description:
      "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
  },
  {
    id: 6,
    title: "Avatar",
    poster_path:
      "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    rating: 7.1,
    genre: "Action, Adventure, Fantasy",
    duration: "2h 42min",
    releaseDate: "2009-12-18",
    description:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    poster_path:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    rating: 3.2,
    genre: "Action, Adventure, Drama",
    duration: "3h 1min",
    releaseDate: "2019-04-26",
    description:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
  },
];

export const sampleCast: Record<number, CastMember[]> = {
  1: [
    { name: "Leonardo DiCaprio", role: "Dom Cobb", image: "https://i.pravatar.cc/150?img=1" },
    { name: "Ken Watanabe", role: "Saito", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Joseph Gordon-Levitt", role: "Arthur", image: "https://i.pravatar.cc/150?img=3" },
    { name: "Elliot Page", role: "Ariadne", image: "https://i.pravatar.cc/150?img=9" },
  ],
  2: [
    { name: "Matthew McConaughey", role: "Cooper", image: "https://i.pravatar.cc/150?img=2" },
    { name: "Anne Hathaway", role: "Brand", image: "https://i.pravatar.cc/150?img=15" },
    { name: "Jessica Chastain", role: "Murph", image: "https://i.pravatar.cc/150?img=17" },
    { name: "Michael Caine", role: "Professor Brand", image: "https://i.pravatar.cc/150?img=7" },
  ],
  3: [
    { name: "Christian Bale", role: "Bruce Wayne", image: "https://i.pravatar.cc/150?img=12" },
    { name: "Heath Ledger", role: "The Joker", image: "https://i.pravatar.cc/150?img=19" },
    { name: "Aaron Eckhart", role: "Harvey Dent", image: "https://i.pravatar.cc/150?img=8" },
    { name: "Gary Oldman", role: "Commissioner Gordon", image: "https://i.pravatar.cc/150?img=14" },
  ],
  4: [
    { name: "John David Washington", role: "Protagonist", image: "https://i.pravatar.cc/150?img=4" },
    { name: "Robert Pattinson", role: "Neil", image: "https://i.pravatar.cc/150?img=6" },
    { name: "Elizabeth Debicki", role: "Kat", image: "https://i.pravatar.cc/150?img=20" },
    { name: "Michael Caine", role: "Sator", image: "https://i.pravatar.cc/150?img=7" },
  ],
  5: [
    { name: "Fionn Whitehead", role: "Tommy", image: "https://i.pravatar.cc/150?img=13" },
    { name: "Tom Hardy", role: "Farrier", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Cillian Murphy", role: "Shivering Soldier", image: "https://i.pravatar.cc/150?img=10" },
    { name: "Harry Styles", role: "Alex", image: "https://i.pravatar.cc/150?img=18" },
  ],
  6: [
    { name: "Sam Worthington", role: "Jake Sully", image: "https://i.pravatar.cc/150?img=16" },
    { name: "Zoe Saldana", role: "Neytiri", image: "https://i.pravatar.cc/150?img=22" },
    { name: "Sigourney Weaver", role: "Grace", image: "https://i.pravatar.cc/150?img=23" },
    { name: "Stephen Lang", role: "Quaritch", image: "https://i.pravatar.cc/150?img=21" },
  ],
  7: [
    { name: "Robert Downey Jr.", role: "Tony Stark", image: "https://i.pravatar.cc/150?img=24" },
    { name: "Chris Evans", role: "Steve Rogers", image: "https://i.pravatar.cc/150?img=25" },
    { name: "Scarlett Johansson", role: "Natasha Romanoff", image: "https://i.pravatar.cc/150?img=26" },
    { name: "Chris Hemsworth", role: "Thor", image: "https://i.pravatar.cc/150?img=27" },
  ],
};

export const sampleDetails: Record<number, MovieDetails> = {
  1: { director: "Christopher Nolan", writer: "Christopher Nolan", budget: "$160M", boxOffice: "$829M" },
  2: { director: "Christopher Nolan", writer: "Jonathan Nolan", budget: "$165M", boxOffice: "$701M" },
  3: { director: "Christopher Nolan", writer: "Jonathan Nolan", budget: "$185M", boxOffice: "$1.005B" },
  4: { director: "Christopher Nolan", writer: "Christopher Nolan", budget: "$200M", boxOffice: "$363M" },
  5: { director: "Christopher Nolan", writer: "Christopher Nolan", budget: "$100M", boxOffice: "$527M" },
  6: { director: "James Cameron", writer: "James Cameron", budget: "$237M", boxOffice: "$2.923B" },
  7: { director: "Anthony & Joe Russo", writer: "Christopher Markus", budget: "$356M", boxOffice: "$2.798B" },
};
