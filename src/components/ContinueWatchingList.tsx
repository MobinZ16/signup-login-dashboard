import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage } from '../mockData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ContinueWatchingPageProps {
  loggedInUserId: number | null;
}

const ContinueWatchingPage: React.FC<ContinueWatchingPageProps> = ({ loggedInUserId }) => {
  const navigate = useNavigate();
  const [continueWatchingItems, setContinueWatchingItems] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For general feedback messages

  // Function to fetch continue watching items
  const fetchContinueWatching = async () => {
    if (!loggedInUserId) {
      setError("برای مشاهده محتوای در حال تماشا، ابتدا وارد شوید.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true); 
      setError(null);
      setMessage(null); // Clear any previous messages
      const response = await axios.get(`http://127.0.0.1:5000/api/continue_watching/${loggedInUserId}`);
      const mappedItems: MovieOrSeries[] = response.data.map((item: any) => ({
        id: item.content_id,
        title: item.title,
        thumbnail: item.thumbnail_url || getPlaceholderImage(300, 180, "No Image"),
        genre: item.content_type === 'movie' ? 'فیلم' : 'سریال',
        year: 0,
        rating: 0,
        progress: item.progress, // Include progress
        media_type: item.content_type,
      }));
      setContinueWatchingItems(mappedItems);
    } catch (err: any) {
      console.error("Failed to fetch continue watching items:", err);
      setError(err.response?.data?.error || "خطا در بارگذاری محتوای در حال تماشا.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContinueWatching();
  }, [loggedInUserId]); // Re-fetch when user ID changes

  const handleContentClick = (id: string, type: 'movie' | 'tv' | undefined) => {
    navigate(`/content/${id}?type=${type}`);
  };

  const handleUpdateProgress = async (item: MovieOrSeries, newProgress: number) => {
    if (!loggedInUserId) {
      setMessage("برای به‌روزرسانی پیشرفت، ابتدا وارد شوید.");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/continue_watching/update', {
        userId: loggedInUserId,
        content_id: item.id,
        content_type: item.media_type,
        title: item.title,
        thumbnail_url: item.thumbnail,
        progress: newProgress,
      });
      setMessage(response.data.message);
      fetchContinueWatching(); // Re-fetch to update the list and progress
    } catch (err: any) {
      console.error("Failed to update progress:", err);
      setMessage(err.response?.data?.error || "خطا در به‌روزرسانی پیشرفت.");
    }
  };

  const handleRemoveItem = async (contentId: string, contentType: 'movie' | 'tv') => {
    if (!loggedInUserId) {
      setMessage("برای حذف آیتم، ابتدا وارد شوید.");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/continue_watching/remove', {
        userId: loggedInUserId,
        content_id: contentId,
        content_type: contentType,
      });
      setMessage(response.data.message);
      fetchContinueWatching(); // Re-fetch to update the list
    } catch (err: any) {
      console.error("Failed to remove item:", err);
      setMessage(err.response?.data?.error || "خطا در حذف آیتم.");
    }
  };

  const renderContinueWatchingCard = (item: MovieOrSeries) => (
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
        {item.progress !== undefined && (
          <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
            <div
              className="bg-[#09f] h-2.5 rounded-full"
              style={{ width: `${item.progress}%` }}
            ></div>
            <span className="text-xs text-gray-400 mt-1 block text-right">{Math.round(item.progress)}%</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-3 space-x-2">
          <button
            onClick={() => handleUpdateProgress(item, item.progress !== undefined ? Math.min(100, item.progress + 10) : 10)}
            className="px-3 py-1 bg-[#09f] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition duration-200 flex-1"
          >
            ادامه (۱۰%+)
          </button>
          <button
            onClick={() => handleRemoveItem(item.id, item.media_type as 'movie' | 'tv')}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition duration-200 flex-1"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white text-center flex items-center justify-center min-h-[500px]">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">در حال بارگذاری محتوای در حال تماشا...</h2>
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
        <h2 className="text-3xl font-extrabold text-[#09f]">ادامه تماشا</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت به داشبورد
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-center ${message.includes("خطا") ? "text-red-400" : "text-green-400"}`}>
          {message}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {continueWatchingItems.length > 0 ? (
          continueWatchingItems.map(renderContinueWatchingCard)
        ) : (
          <p className="col-span-full text-center text-gray-400">هیچ محتوایی برای ادامه تماشا وجود ندارد.</p>
        )}
      </div>
    </div>
  );
};

export default ContinueWatchingPage;
