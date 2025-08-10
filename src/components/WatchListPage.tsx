import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface WatchlistPageProps {
  loggedInUserId: number | null;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ loggedInUserId }) => {
  const navigate = useNavigate();
  const [watchlistItems, setWatchlistItems] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeMessage, setRemoveMessage] = useState<string | null>(null); // For removal feedback

  // Function to fetch watchlist items
  const fetchWatchlist = async () => {
    if (!loggedInUserId) {
      setError("برای مشاهده لیست تماشا، ابتدا وارد شوید.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setRemoveMessage(null); // Clear any previous messages
      const response = await axios.get(`http://127.0.0.1:5000/api/watchlist/${loggedInUserId}`);
      const mappedWatchlist: MovieOrSeries[] = response.data.map((item: any) => ({
        id: item.content_id,
        title: item.title,
        thumbnail: item.thumbnail_url || getPlaceholderImage(300, 180, "No Image"),
        genre: item.content_type === 'movie' ? 'فیلم' : 'سریال', // Use content_type as genre for display
        year: 0, // Not stored in watchlist_item table, consider fetching full details if needed
        rating: 0, // Not stored in watchlist_item table
        media_type: item.content_type,
      }));
      setWatchlistItems(mappedWatchlist);
    } catch (err: any) {
      console.error("Failed to fetch watchlist:", err);
      setError(err.response?.data?.error || "خطا در بارگذاری لیست تماشا.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [loggedInUserId]); // Re-fetch when user ID changes

  const handleContentClick = (id: string, type: 'movie' | 'tv' | undefined) => {
    navigate(`/content/${id}?type=${type}`);
  };

  const handleRemoveFromWatchlist = async (contentId: string, contentType: 'movie' | 'tv') => {
    if (!loggedInUserId) {
      setRemoveMessage("برای حذف از لیست تماشا، ابتدا وارد شوید.");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/watchlist/remove', {
        userId: loggedInUserId,
        content_id: contentId,
        content_type: contentType,
      });
      setRemoveMessage(response.data.message);
      // Refresh the watchlist after successful removal
      fetchWatchlist(); 
    } catch (err: any) {
      console.error("Failed to remove from watchlist:", err);
      setRemoveMessage(err.response?.data?.error || "خطا در حذف از لیست تماشا.");
    }
  };

  const renderWatchlistCard = (item: MovieOrSeries) => (
    <div
      key={item.id}
      className="relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-60 object-cover cursor-pointer"
        onError={(e) => { e.currentTarget.src = getPlaceholderImage(300, 450, "خطای عکس"); }}
        onClick={() => handleContentClick(item.id, item.media_type)}
      />
      <div className="p-3 flex-grow">
        <h3 className="text-white font-semibold text-lg truncate cursor-pointer"
            onClick={() => handleContentClick(item.id, item.media_type)}>
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{item.genre}</p>
        <button
          onClick={() => handleRemoveFromWatchlist(item.id, item.media_type as 'movie' | 'tv')}
          className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition duration-200"
        >
          حذف از لیست تماشا
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white text-center flex items-center justify-center min-h-[500px]">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">در حال بارگذاری لیست تماشا...</h2>
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
        <h2 className="text-3xl font-extrabold text-[#09f]">لیست تماشای من</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      {removeMessage && (
        <p className={`mb-4 text-center ${removeMessage.includes("خطا") ? "text-red-400" : "text-green-400"}`}>
          {removeMessage}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {watchlistItems.length > 0 ? (
          watchlistItems.map(renderWatchlistCard)
        ) : (
          <p className="col-span-full text-center text-gray-400">شما هیچ محتوایی به لیست تماشای خود اضافه نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
