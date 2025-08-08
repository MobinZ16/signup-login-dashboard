import havocPoster from "./assets/ubP2OsF3GlfqYPvXyLw9d78djGX.webp"
import bigBangTheory from "./assets/ooBGRQBdbGzBxAVfExiO8r7kloA.webp"
import aWorkingMan from "./assets/6FRFIogh3zFnVWn7Z6zcYnIbRcX.webp"
import theLastOfUs from "./assets/theLastOfUswebp.webp"
import deadpoolAndWolverine from "./assets/deadpool.webp"
import zombieDetective from "./assets/zombie detective.webp"
import theWitcher from "./assets/the witcher.webp"
import dark from "./assets/dark.webp"
import strangerThings from "./assets/stranger things.webp"
import theMandalorian from "./assets/mandalorian.webp"
import howToTrainYourDragon from "./assets/how to train your dragon.webp"
import theNakedGun from "./assets/the naked gun.webp"
import wallE from "./assets/wall-e.webp"
import fall from "./assets/fall.webp"
import theLastSparkOfHope from "./assets/the last spark of hope.webp"
import berlin from "./assets/berlin.webp"
import prisonBreak from "./assets/prison break.webp"
import tedLasso from "./assets/ted lasso.webp"

export interface MovieOrSeries {
  id: string;
  title: string;
  thumbnail: string; // URL to an image (for cards)
  poster?: string; // URL to a larger image (for featured content)
  progress?: number; // 0-100 for continue watching
  genre: string;
  year: number;
  rating: number;
  description?: string; // For featured content
  episode?: string; // For recently updated series
  season?: string; // For recently updated series
}

export interface UserDashboardData {
  userId: string;
  userName: string;
  email: string;
  continueWatching: MovieOrSeries[];
  myWatchlist: MovieOrSeries[];
  recommendations: MovieOrSeries[];
  trending: MovieOrSeries[]; // New: Trending content
  popular: MovieOrSeries[]; // New: Popular content
  recentlyUpdated: MovieOrSeries[]; // New: Recently updated series
  featuredMovie?: MovieOrSeries; // New: Featured movie/series
}

// Placeholder image function (replace with actual image URLs in a real app)
const getPlaceholderImage = (width: number, height: number, text: string, bgColor: string = '000', textColor: string = 'fff') => 
  `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text.replace(/ /g, '+')}`;

export const mockUserDashboardData: UserDashboardData[] = [
  {
    userId: "user123",
    userName: "Jude",
    email: "ali@example.com",
    
    featuredMovie: {
      id: "f101",
      title: "Havoc 2025",
      thumbnail: havocPoster, // Example for featured image
      poster: havocPoster, // Larger image for main display
      genre: "Action",
      year: 2025,
      rating: 6.1,
      description: "An action-packed thriller set in the near future depicting a battle for survival."
    },

    continueWatching: [
      {
        id: "cw101",
        title: "Big Bang Theory",
        thumbnail: bigBangTheory,
        progress: 85,
        genre: "Comedy",
        year: 2007,
        rating: 8.2,
        episode: "S02 EP14"
      },
      {
        id: "cw102",
        title: "Zombie Detective",
        thumbnail: zombieDetective,
        progress: 50,
        genre: "Comedy",
        year: 2020,
        rating: 7.4,
        episode: "S01 EP04"
      },
    ],
    myWatchlist: [
      {
        id: "wl101",
        title: "The Witcher",
        thumbnail: theWitcher,
        genre: "Fantasy",
        year: 2019,
        rating: 8.2
      },
      {
        id: "wl102",
        title: "Dark",
        thumbnail: dark,
        genre: "Sci-Fi",
        year: 2017,
        rating: 8.8
      },
    ],
    recommendations: [
      {
        id: "rec101",
        title: "Stranger Things",
        thumbnail: strangerThings,
        genre: "Sci-Fi",
        year: 2016,
        rating: 8.7
      },
      {
        id: "rec102",
        title: "The Mandalorian",
        thumbnail: theMandalorian,
        genre: "Sci-Fi",
        year: 2019,
        rating: 8.7
      },
    ],
    trending: [
      {
        id: "tr101",
        title: "How to train your dragon",
        thumbnail: howToTrainYourDragon,
        genre: "Fantasy",
        year: 2025,
        rating: 7.9
      },
      {
        id: "tr102",
        title: "A Working Man 2025",
        thumbnail: aWorkingMan,
        genre: "Drama",
        year: 2025,
        rating: 5.7
      },
      {
        id: "tr103",
        title: "The naked gun",
        thumbnail: theNakedGun,
        genre: "Comedy",
        year: 2025,
        rating: 7.0
      },
    ],
    popular: [
      {
        id: "pop101",
        title: "WALL-E 2008",
        thumbnail: wallE,
        genre: "Animation",
        year: 2008,
        rating: 8.4
      },
      {
        id: "pop102",
        title: "Deadpool & Wolverine 2024",
        thumbnail: deadpoolAndWolverine,
        genre: "Action",
        year: 2024,
        rating: 8.0
      },
      {
        id: "pop103",
        title: "Fall 2022",
        thumbnail: fall,
        genre: "Thriller",
        year: 2022,
        rating: 6.4
      },
      {
        id: "pop104",
        title: "The Last Spark of Hope 2022",
        thumbnail: theLastSparkOfHope,
        genre: "Sci-Fi",
        year: 2022,
        rating: 6.8
      },
    ],
    recentlyUpdated: [
      {
        id: "ru101",
        title: "The Last of Us",
        thumbnail: theLastOfUs,
        genre: "Drama",
        year: 2023,
        rating: 8.7,
        season: "S02",
        episode: "EP03"
      },
      {
        id: "ru102",
        title: "Berlin",
        thumbnail: berlin,
        genre: "Crime",
        year: 2023,
        rating: 7.0,
        season: "S02",
        episode: "EP01"
      },
      {
        id: "ru103",
        title: "Prison Break",
        thumbnail: prisonBreak,
        genre: "Action",
        year: 2005,
        rating: 6.0,
        season: "S02",
        episode: "EP06"
      },
      {
        id: "ru104",
        title: "Ted Lasso",
        thumbnail: tedLasso,
        genre: "Comedy",
        year: 2020,
        rating: 8.8,
        season: "S03",
        episode: "EP01"
      },
    ],
  },
  {
    userId: "user456",
    userName: "سارا",
    email: "sara@example.com",
    continueWatching: [],
    myWatchlist: [],
    recommendations: [],
    trending: [],
    popular: [],
    recentlyUpdated: [],
    featuredMovie: undefined,
  },
];
