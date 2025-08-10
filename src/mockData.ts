// src/mockData.ts

export interface MovieOrSeries {
  id: string;
  title: string;
  thumbnail: string; // TMDB's poster_path for w300 or w500
  poster?: string; // TMDB's backdrop_path for original size
  progress?: number; // 0-100 for continue watching
  genre: string; // Will now be mapped from genre_ids to a string name
  genre_ids?: number[]; // To store raw TMDB genre IDs
  year: number; // TMDB's release_date or first_air_date year
  rating: number; // TMDB's vote_average
  description?: string; // TMDB's overview
  director?: string; // From TMDB credits
  cast?: string[]; // Array of cast members for detail page
  episode?: string; // For series episodes
  season?: string; // For series seasons
  media_type?: 'movie' | 'tv'; // New: To distinguish between movie and tv show
}

export interface UserDashboardData {
  userId: string;
  userName: string;
  email: string;
  continueWatching: MovieOrSeries[]; 
  myWatchlist: MovieOrSeries[];
  recommendations: MovieOrSeries[]; 
  trending: MovieOrSeries[]; 
  popular: MovieOrSeries[]; 
  recentlyUpdated: MovieOrSeries[]; 
  featuredMovie?: MovieOrSeries;
}

// Helper function to get placeholder image (already present)
export const getPlaceholderImage = (width: number, height: number, text: string = "No Image", bgColor: string = '000', textColor: string = 'fff') => 
  `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text.replace(/ /g, '+')}`;

// TMDB Genre IDs to Names mapping
const genreMap: { [key: number]: string } = {
  28: "اکشن",
  12: "ماجراجویی",
  16: "انیمیشن",
  35: "کمدی",
  80: "جنایی",
  99: "مستند",
  18: "درام",
  10751: "خانوادگی",
  14: "فانتزی",
  36: "تاریخی",
  27: "ترسناک",
  10402: "موزیکال",
  9648: "رازآلود",
  10749: "عاشقانه",
  878: "علمی-تخیلی",
  10770: "فیلم تلویزیونی",
  53: "هیجان‌انگیز",
  10752: "جنگی",
  37: "وسترن",
  // TV show specific genres (some overlap with movies)
  10759: "اکشن و ماجراجویی (TV)", 
  10762: "بچه‌ها (TV)", 
  10763: "اخبار (TV)", 
  10764: "واقع‌گرایانه (TV)", 
  10765: "علمی-تخیلی و فانتزی (TV)", 
  10766: "سوپ اپرا (TV)", 
  10767: "تاک شو (TV)", 
  10768: "جنگی و سیاسی (TV)", 
};

// Helper function to map TMDB genre IDs to human-readable names
export const mapGenreIdsToNames = (genreIds: number[] | undefined, mediaType: 'movie' | 'tv' | undefined): string => {
  if (!genreIds || genreIds.length === 0) {
    return mediaType === 'movie' ? "فیلم" : mediaType === 'tv' ? "سریال" : "نامشخص";
  }
  const genres = genreIds.map(id => genreMap[id]).filter(name => name); 
  return genres.length > 0 ? genres.join(', ') : (mediaType === 'movie' ? "فیلم" : mediaType === 'tv' ? "سریال" : "نامشخص");
};

// Define TMDB image base URL
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Helper function to get full image URL from TMDB path
// This function will now be exported and used across all components
export const getTmdbImageUrl = (path: string | null | undefined, size: string = 'w500', fallbackWidth: number = 300, fallbackHeight: number = 450) => {
  if (!path) {
    return getPlaceholderImage(fallbackWidth, fallbackHeight, "No Image"); // Fallback if no path
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};
