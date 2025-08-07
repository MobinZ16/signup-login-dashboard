// src/mockData.ts

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
    userName: "علی",
    email: "ali@example.com",
    
    featuredMovie: {
      id: "f101",
      title: "Havoc 2025",
      thumbnail: getPlaceholderImage(600, 350, "Havoc 2025", "272257", "09f"), // Example for featured image
      poster: getPlaceholderImage(1200, 600, "Havoc 2025 Featured", "272257", "09f"), // Larger image for main display
      genre: "اکشن",
      year: 2025,
      rating: 6.1,
      description: "یک فیلم اکشن هیجان‌انگیز در آینده‌ای نزدیک که نبردی برای بقا را به تصویر می‌کشد."
    },

    continueWatching: [
      {
        id: "cw101",
        title: "تئوری بیگ بنگ",
        thumbnail: getPlaceholderImage(200, 120, "Big Bang Theory", "09f", "272257"),
        progress: 85,
        genre: "کمدی",
        year: 2007,
        rating: 8.2,
        episode: "S02 EP14"
      },
      {
        id: "cw102",
        title: "کارآگاه زامبی",
        thumbnail: getPlaceholderImage(200, 120, "Zombie Detective", "09f", "272257"),
        progress: 50,
        genre: "کمدی",
        year: 2020,
        rating: 7.4,
        episode: "S01 EP04"
      },
    ],
    myWatchlist: [
      {
        id: "wl101",
        title: "ویچر",
        thumbnail: getPlaceholderImage(300, 180, "The Witcher", "09f", "272257"),
        genre: "فانتزی",
        year: 2019,
        rating: 8.2
      },
      {
        id: "wl102",
        title: "دارک",
        thumbnail: getPlaceholderImage(300, 180, "Dark", "09f", "272257"),
        genre: "علمی-تخیلی",
        year: 2017,
        rating: 8.8
      },
    ],
    recommendations: [
      {
        id: "rec101",
        title: "چیزهای عجیب",
        thumbnail: getPlaceholderImage(300, 180, "Stranger Things", "09f", "272257"),
        genre: "علمی-تخیلی",
        year: 2016,
        rating: 8.7
      },
      {
        id: "rec102",
        title: "مندلورین",
        thumbnail: getPlaceholderImage(300, 180, "The Mandalorian", "09f", "272257"),
        genre: "علمی-تخیلی",
        year: 2019,
        rating: 8.7
      },
    ],
    trending: [
      {
        id: "tr101",
        title: "Warfare 2025",
        thumbnail: getPlaceholderImage(300, 180, "Warfare 2025", "09f", "272257"),
        genre: "جنگی",
        year: 2025,
        rating: 7.4
      },
      {
        id: "tr102",
        title: "A Working Man 2025",
        thumbnail: getPlaceholderImage(300, 180, "Working Man 2025", "09f", "272257"),
        genre: "درام",
        year: 2025,
        rating: 5.7
      },
      {
        id: "tr103",
        title: "فیلم ترند ۳",
        thumbnail: getPlaceholderImage(300, 180, "Trending Film 3", "09f", "272257"),
        genre: "کمدی",
        year: 2024,
        rating: 7.0
      },
    ],
    popular: [
      {
        id: "pop101",
        title: "WALL-E 2008",
        thumbnail: getPlaceholderImage(300, 180, "WALL-E", "09f", "272257"),
        genre: "انیمیشن",
        year: 2008,
        rating: 8.4
      },
      {
        id: "pop102",
        title: "Deadpool & Wolverine 2024",
        thumbnail: getPlaceholderImage(300, 180, "Deadpool & Wolverine", "09f", "272257"),
        genre: "اکشن",
        year: 2024,
        rating: 8.0
      },
      {
        id: "pop103",
        title: "Breath of Life 2023",
        thumbnail: getPlaceholderImage(300, 180, "Breath of Life", "09f", "272257"),
        genre: "درام",
        year: 2023,
        rating: 7.5
      },
      {
        id: "pop104",
        title: "The Last Spark of Hope 2022",
        thumbnail: getPlaceholderImage(300, 180, "Last Spark of Hope", "09f", "272257"),
        genre: "علمی-تخیلی",
        year: 2022,
        rating: 6.8
      },
    ],
    recentlyUpdated: [
      {
        id: "ru101",
        title: "آخرین بازمانده از ما",
        thumbnail: getPlaceholderImage(80, 80, "The Last of Us", "09f", "272257"),
        genre: "درام",
        year: 2023,
        rating: 8.7,
        season: "S02",
        episode: "EP03"
      },
      {
        id: "ru102",
        title: "برلین",
        thumbnail: getPlaceholderImage(80, 80, "Berlin", "09f", "272257"),
        genre: "جنایی",
        year: 2023,
        rating: 7.0,
        season: "S02",
        episode: "EP01"
      },
      {
        id: "ru103",
        title: "فرار از زندان",
        thumbnail: getPlaceholderImage(80, 80, "Prison Break", "09f", "272257"),
        genre: "اکشن",
        year: 2005,
        rating: 6.0,
        season: "S02",
        episode: "EP06"
      },
      {
        id: "ru104",
        title: "تد لاسو",
        thumbnail: getPlaceholderImage(80, 80, "Ted Lasso", "09f", "272257"),
        genre: "کمدی",
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
