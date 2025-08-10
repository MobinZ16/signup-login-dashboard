import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl, mapGenreIdsToNames } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const TrendingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trendingContent, setTrendingContent] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:5000/api/tmdb/trending_all');
        const mappedContent: MovieOrSeries[] = response.data.map((item: any) => ({
          id: String(item.id),
          title: item.title || item.name || 'N/A',
          thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 450),
          genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
          year: new Date(item.release_date || item.first_air_date || '0').getFullYear() || 0,
          rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
          media_type: item.media_type,
        }));
        setTrendingContent(mappedContent.filter(item => item.year > 0 && (item.media_type === 'movie' || item.media_type === 'tv')));
      } catch (err: any) {
        console.error("Failed to fetch trending content:", err);
        setError("خطا در بارگذاری محتوای ترندینگ. لطفاً سرور را بررسی کنید و از اتصال به اینترنت مطمئن شوید.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  const handleContentClick = (id: string, type: 'movie' | 'tv' | undefined) => {
    navigate(`/content/${id}?type=${type}`);
  };

  const renderContentCard = (item: MovieOrSeries) => (
    <div
      key={item.id}
      className="relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
      onClick={() => handleContentClick(item.id, item.media_type)}
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-60 object-cover"
        onError={(e) => { e.currentTarget.src = getPlaceholderImage(300, 450, "خطای عکس"); }}
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
        <h2 className="text-3xl font-extrabold text-[#09f]">محتوای ترندینگ</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {trendingContent.length > 0 ? (
          trendingContent.map(renderContentCard)
        ) : (
          <p className="col-span-full text-center text-gray-400">هیچ محتوای ترندینگی یافت نشد.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
