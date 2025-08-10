import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FavoritesPageProps {
  loggedInUserId: number | null;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ loggedInUserId }) => {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!loggedInUserId) {
        setError("برای مشاهده علاقه‌مندی‌ها، ابتدا وارد شوید.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://127.0.0.1:5000/api/favorites/${loggedInUserId}`);
        const mappedFavorites: MovieOrSeries[] = response.data.map((item: any) => ({
          id: item.content_id,
          title: item.title,
          thumbnail: item.thumbnail_url || getPlaceholderImage(300, 180, "No Image"),
          genre: item.content_type === 'movie' ? 'فیلم' : 'سریال', // Use content_type as genre for display
          year: 0, // Not stored in favorite_item table, consider fetching full details if needed
          rating: 0, // Not stored in favorite_item table
          media_type: item.content_type,
        }));
        setFavoriteItems(mappedFavorites);
      } catch (err: any) {
        console.error("Failed to fetch favorites:", err);
        setError(err.response?.data?.error || "خطا در بارگذاری علاقه‌مندی‌ها.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [loggedInUserId]); // Re-fetch when user ID changes

  const handleContentClick = (id: string, type: 'movie' | 'tv' | undefined) => {
    navigate(`/content/${id}?type=${type}`);
  };

  const renderFavoriteCard = (item: MovieOrSeries) => (
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
        <p className="text-gray-400 text-sm mt-1">{item.genre}</p> {/* Displaying content type as genre */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white text-center">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">در حال بارگذاری علاقه‌مندی‌ها...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-red-400 text-center">
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
        <h2 className="text-3xl font-extrabold text-[#09f]">علاقه‌مندی‌های من</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {favoriteItems.length > 0 ? (
          favoriteItems.map(renderFavoriteCard)
        ) : (
          <p className="col-span-full text-center text-gray-400">شما هیچ محتوایی به علاقه‌مندی‌های خود اضافه نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
