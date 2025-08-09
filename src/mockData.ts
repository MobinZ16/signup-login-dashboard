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
  director?: string; // For featured content
  cast?: string[]; // For featured content
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

export const getAllMockContent = (): MovieOrSeries[] => {
  const allContent: MovieOrSeries[] = [];
  const addUnique = (item: MovieOrSeries) => {
    if (!allContent.some(content => content.id === item.id)) {
      allContent.push(item);
    }
  };

  mockUserDashboardData.forEach(userData => {
    userData.continueWatching.forEach(addUnique);
    userData.myWatchlist.forEach(addUnique);
    userData.recommendations.forEach(addUnique);
    userData.trending.forEach(addUnique);
    userData.popular.forEach(addUnique);
    userData.recentlyUpdated.forEach(addUnique);
    if (userData.featuredMovie) {
      addUnique(userData.featuredMovie);
    }
  });
  return allContent;
};

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
      description: "An action-packed thriller set in the near future depicting a battle for survival.",
      director: "Gareth Evans",
      cast: ["Tom Hardy", "Jessie Mie Li", "Timothy Olyphant"]
    },

    continueWatching: [
      {
        id: "cw101",
        title: "Big Bang Theory",
        thumbnail: bigBangTheory,
        poster: bigBangTheory,
        progress: 85,
        genre: "Comedy",
        year: 2007,
        rating: 8.2,
        episode: "S02 EP14",
        director: "Chuck Lorre",
        cast: ["Johnny Galecki", "Jim Parsons", "Kaley Cuoco"],
        description: "A group of nerdy friends navigate life and love in this iconic sitcom."
      },
      {
        id: "cw102",
        title: "Zombie Detective",
        thumbnail: zombieDetective,
        poster: zombieDetective,
        progress: 50,
        genre: "Comedy",
        year: 2020,
        rating: 7.4,
        episode: "S01 EP04",
        director: "Baek Eun-jin",
        cast: ["Choi Jin-woong", "Park Ju-hyun", "Hwang Bo-ra"],
        description: "A detective with amnesia teams up with a zombie to solve crimes."
      },
    ],
    myWatchlist: [
      {
        id: "wl101",
        title: "The Witcher",
        thumbnail: theWitcher,
        poster: theWitcher,
        genre: "Fantasy",
        year: 2019,
        rating: 8.2,
        episode: "S01 EP01",
        director: "Lauren Schmidt Hissrich",
        cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
        description: "In a world of magic and monsters, Geralt of Rivia battles to find his place."
      },
      {
        id: "wl102",
        title: "Dark",
        thumbnail: dark,
        poster: dark,
        genre: "Sci-Fi",
        year: 2017,
        rating: 8.8,
        episode: "S01 EP01",
        director: "Baran bo Odar",
        cast: ["Olivia Cooke", "Mary Stuart Masterson", "Michael Irby"],
        description: "A family saga with a supernatural twist, set in a German town."
      },
    ],
    recommendations: [
      {
        id: "rec101",
        title: "Stranger Things",
        thumbnail: strangerThings,
        poster: strangerThings,
        genre: "Sci-Fi",
        year: 2016,
        rating: 8.7,
        episode: "S01 EP01",
        director: "Ross Duffer",
        cast: ["Millie Bobby Brown", "David Harbour", "Finn Wolfhard"],
        description: "A group of kids uncover a series of supernatural mysteries in their small town."
      },
      {
        id: "rec102",
        title: "The Mandalorian",
        thumbnail: theMandalorian,
        poster: theMandalorian,
        genre: "Sci-Fi",
        year: 2019,
        rating: 8.7,
        episode: "S01 EP01",
        director: "Jon Favreau",
        cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers"],
        description: "The travels of a lone bounty hunter in the outer reaches of the galaxy."
      },
    ],
    trending: [
      {
        id: "tr101",
        title: "How to train your dragon",
        thumbnail: howToTrainYourDragon,
        poster: howToTrainYourDragon,
        genre: "Fantasy",
        year: 2025,
        rating: 7.9,
        director: "Dean DeBlois",
        cast: ["Mason Thomas", "Nico Parker", "Gerard Butler"],
        description: "The adventures of Hiccup and his dragon Toothless continue in this animated sequel."
      },
      {
        id: "tr102",
        title: "A Working Man 2025",
        thumbnail: aWorkingMan,
        poster: aWorkingMan,
        genre: "Drama",
        year: 2025,
        rating: 5.7,
        director: "David Ayer",
        cast: ["Jason Statham", "Jason Flemyng", "Merab Ninidze"],
        description: "A story about a man who struggles to keep his family together while dealing with the pressures of work and life."
      },
      {
        id: "tr103",
        title: "The naked gun",
        thumbnail: theNakedGun,
        poster: theNakedGun,
        genre: "Comedy",
        year: 2025,
        rating: 7.0,
        director: "Akiva Schaffer",
        cast: ["Liam Neeson", "Pamela Anderson", "Paul Walter Hauser"],
        description: "A bumbling detective is assigned to protect a pop singer from an unknown assailant."
      },
    ],
    popular: [
      {
        id: "pop101",
        title: "WALL-E 2008",
        thumbnail: wallE,
        poster: wallE,
        genre: "Animation",
        year: 2008,
        rating: 8.4,
        director: "Andrew Stanton",
        cast: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
        description: "In a future where humanity has abandoned Earth, a small waste-collecting robot embarks on a journey to find a new home."
      },
      {
        id: "pop102",
        title: "Deadpool & Wolverine 2024",
        thumbnail: deadpoolAndWolverine,
        poster: deadpoolAndWolverine,
        genre: "Action",
        year: 2024,
        rating: 8.0,
        director: "Shawn Levy",
        cast: ["Ryan Reynolds", "Hugh Jackman", "Morena Baccarin"],
        description: "Deadpool teams up with Wolverine to take on a new threat."
      },
      {
        id: "pop103",
        title: "Fall 2022",
        thumbnail: fall,
        poster: fall,
        genre: "Thriller",
        year: 2022,
        rating: 6.4,
        director: "Scott Mann",
        cast: ["Grace Caroline Currey", "Jeffrey Dean Morgan", "Angus Cloud"],
        description: "A group of friends find themselves trapped on a remote radio tower."

      },
      {
        id: "pop104",
        title: "The Last Spark of Hope 2022",
        thumbnail: theLastSparkOfHope,
        poster: theLastSparkOfHope,
        genre: "Sci-Fi",
        year: 2022,
        rating: 6.8,
        director: "Piotr Biedron",
        cast: ["Magdalena Wieczorek", "Jaceb Beler"],
        description: "In a dystopian future, a group of rebels fight to ignite the last spark of hope for humanity."
      },
    ],
    recentlyUpdated: [
      {
        id: "ru101",
        title: "The Last of Us",
        thumbnail: theLastOfUs,
        poster: theLastOfUs,
        genre: "Drama",
        year: 2023,
        rating: 8.7,
        season: "S02",
        episode: "EP03",
        description: "The journey continues as Joel and Ellie face new challenges.",
        director: "Neil Druckmann",
        cast: ["Pedro Pascal", "Bella Ramsey", "Anna Torv"]
      },
      {
        id: "ru102",
        title: "Berlin",
        thumbnail: berlin,
        poster: berlin,
        genre: "Crime",
        year: 2023,
        rating: 7.0,
        season: "S02",
        episode: "EP01",
        description: "A deep dive into the criminal underbelly of Berlin.",
        director: "Alex Pina",
        cast: ["Pedro Alonso", "Samantha Siquerios", "Tristán Ulloa"]
      },
      {
        id: "ru103",
        title: "Prison Break",
        thumbnail: prisonBreak,
        poster: prisonBreak,
        genre: "Action",
        year: 2005,
        rating: 6.0,
        season: "S02",
        episode: "EP06",
        description: "The escape plan is set in motion.",
        director: "Paul Scheuring",
        cast: ["Wentworth Miller", "Dominic Purcell", "Sarah Wayne Callies"]
      },
      {
        id: "ru104",
        title: "Ted Lasso",
        thumbnail: tedLasso,
        poster: tedLasso,
        genre: "Comedy",
        year: 2020,
        rating: 8.8,
        season: "S03",
        episode: "EP01",
        description: "A new chapter begins as Ted takes on new challenges.",
        director: "Bill Lawrence",
        cast: ["Jason Sudeikis", "Hannah Waddingham", "Brett Goldstein"]
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