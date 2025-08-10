import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl, mapGenreIdsToNames } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const MoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/api/tmdb/popular_movies');
        
        const mappedMovies: MovieOrSeries[] = response.data.map((item: any) => ({
          id: String(item.id),
          title: item.title || 'N/A',
          thumbnail: getTmdbImageUrl(item.poster_path, 'w500', 300, 450), // Use getTmdbImageUrl
          genre: mapGenreIdsToNames(item.genre_ids, 'movie'), // Map genre IDs
          year: new Date(item.release_date || '0').getFullYear() || 0,
          rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
          media_type: 'movie', 
        }));
        setMovies(mappedMovies.filter(item => item.year > 0));
      } catch (err: any) {
        console.error("Failed to fetch movies:", err);
        setError("خطا در بارگذاری فیلم‌ها. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovieCard = (item: MovieOrSeries) => (
    <div
      key={item.id}
      className="relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/content/${item.id}?type=${item.media_type}`)}
    >
      <img
        src={item.thumbnail} // Use item.thumbnail which is already a full TMDB URL
        alt={item.title}
        className="w-full h-60 object-cover"
        onError={(e) => { e.currentTarget.src = getPlaceholderImage(300, 450, "خطای عکس"); }} // Fallback
      />
      <div className="p-3 flex-grow">
        <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{item.genre} | {item.year}</p>
        {item.rating && (
          <div className="flex items-center text-yellow-400 text-sm mt-1">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
            </svg>
            {item.rating} / 10
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-8">
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
        <h2 className="text-3xl font-extrabold text-[#09f]">فیلم‌ها</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.length > 0 ? movies.map(renderMovieCard) : <p className="col-span-full text-center text-gray-400">فیلمی یافت نشد.</p>}
      </div>
    </div>
  );
};

export default MoviesPage;
