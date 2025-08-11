import React, { useState, useEffect, useCallback } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl, mapGenreIdsToNames } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import ContentCard from './content/ContentCard';

interface MoviesPageProps {
  loggedInUserId: number | null; // Receive loggedInUserId
}

const MoviesPage: React.FC<MoviesPageProps> = ({ loggedInUserId }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myWatchlist, setMyWatchlist] = useState<MovieOrSeries[]>([]); // State for user's watchlist
  const [myFavorites, setMyFavorites] = useState<MovieOrSeries[]>([]); // State for user's favorites

  // Helper sets for quick lookup
  const watchlistedIds = new Set(myWatchlist.map(item => `${item.id}-${item.media_type}`));
  const favoritedIds = new Set(myFavorites.map(item => `${item.id}-${item.media_type}`));

  // Function to fetch user-specific lists (watchlist and favorites)
  const fetchUserLists = useCallback(async () => {
    if (loggedInUserId) {
      try {
        const watchlistRes = await axios.get(`http://127.0.0.1:5000/api/watchlist/${loggedInUserId}`);
        setMyWatchlist(watchlistRes.data.map((item: any) => ({
          id: item.content_id,
          media_type: item.content_type,
          title: item.title,
          thumbnail: item.thumbnail_url,
        })));

        const favoritesRes = await axios.get(`http://127.0.0.1:5000/api/favorites/${loggedInUserId}`);
        setMyFavorites(favoritesRes.data.map((item: any) => ({
          id: item.content_id,
          media_type: item.content_type,
          title: item.title,
          thumbnail: item.thumbnail_url,
        })));
      } catch (err) {
        console.error("Failed to fetch user lists:", err);
        // Optionally set an error state or message for user lists
      }
    } else {
      setMyWatchlist([]);
      setMyFavorites([]);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch user lists first
        await fetchUserLists();

        const response = await axios.get('http://127.0.0.1:5000/api/tmdb/popular_movies');
        const mappedMovies: MovieOrSeries[] = response.data.map((item: any) => ({
          id: String(item.id),
          title: item.title || 'N/A',
          thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 450),
          genre: mapGenreIdsToNames(item.genre_ids, 'movie'),
          year: new Date(item.release_date || '0').getFullYear() || 0,
          rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
          media_type: 'movie',
        }));
        setMovies(mappedMovies.filter(item => item.year > 0)); // Filter out items with no valid year
      } catch (err: any) {
        console.error("Failed to fetch popular movies:", err);
        setError("خطا در بارگذاری فیلم‌های محبوب. لطفاً سرور را بررسی کنید و از اتصال به اینترنت مطمئن شوید.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, [loggedInUserId, fetchUserLists]); // Re-fetch when loggedInUserId or user lists change

  // Callbacks for ContentCard to notify MoviesPage about changes
  const handleWatchlistToggled = useCallback(() => {
    fetchUserLists(); // Re-fetch to update the local watchlist state
  }, [fetchUserLists]);

  const handleFavoriteToggled = useCallback(() => {
    fetchUserLists(); // Re-fetch to update the local favorites state
  }, [fetchUserLists]);


  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-red-400 text-center flex items-center justify-center min-h-[500px]">
        <h2 className="text-3xl font-extrabold text-red-500">خطا</h2>
        <p className="text-lg">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#09f]">فیلم‌های محبوب</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.length > 0 ? (
          movies.map(item => (
            <ContentCard
              key={`${item.id}-${item.media_type}`}
              item={item}
              loggedInUserId={loggedInUserId}
              initialIsWatchlisted={watchlistedIds.has(`${item.id}-${item.media_type}`)}
              initialIsFavorited={favoritedIds.has(`${item.id}-${item.media_type}`)}
              onWatchlistToggled={handleWatchlistToggled}
              onFavoriteToggled={handleFavoriteToggled}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">هیچ فیلمی یافت نشد.</p>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
