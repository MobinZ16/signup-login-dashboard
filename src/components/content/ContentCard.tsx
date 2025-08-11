import React, { useState, useEffect } from 'react';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl } from '../../mockData'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ContentCardProps {
  item: MovieOrSeries;
  loggedInUserId: number | null;
  // These props tell the card its initial watchlist/favorite status
  initialIsWatchlisted: boolean;
  initialIsFavorited: boolean;
  // Callbacks to notify parent of changes (and potentially trigger a refresh if needed)
  onWatchlistToggled: (contentId: string, contentType: 'movie' | 'tv', isAdded: boolean) => void;
  onFavoriteToggled: (contentId: string, contentType: 'movie' | 'tv', isAdded: boolean) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  loggedInUserId,
  initialIsWatchlisted,
  initialIsFavorited,
  onWatchlistToggled,
  onFavoriteToggled,
}) => {
  const navigate = useNavigate();
  const [isWatchlisted, setIsWatchlisted] = useState(initialIsWatchlisted);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Update internal state if initial props change (e.g., parent refreshes lists)
  useEffect(() => {
    setIsWatchlisted(initialIsWatchlisted);
  }, [initialIsWatchlisted]);

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleContentClick = () => {
    navigate(`/content/${item.id}?type=${item.media_type}`);
  };

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from navigating
    if (!loggedInUserId) {
      setFeedbackMessage("برای افزودن/حذف از لیست تماشا، ابتدا وارد شوید.");
      return;
    }

    const endpoint = isWatchlisted ? 'http://127.0.0.1:5000/api/watchlist/remove' : 'http://127.0.0.1:5000/api/watchlist/add';
    const payload = {
      userId: loggedInUserId,
      content_id: item.id,
      content_type: item.media_type,
      title: item.title,
      thumbnail_url: item.thumbnail,
    };

    try {
      const response = await axios.post(endpoint, payload);
      setFeedbackMessage(response.data.message);
      setIsWatchlisted(!isWatchlisted); // Optimistic update
      if (item.media_type === "movie" || item.media_type === "tv") {
        onWatchlistToggled(item.id, item.media_type, !isWatchlisted);
      }
    } catch (err: any) {
      console.error("Watchlist toggle failed:", err);
      setFeedbackMessage(err.response?.data?.error || "خطا در به‌روزرسانی لیست تماشا.");
    } finally {
      // Clear message after some time
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from navigating
    if (!loggedInUserId) {
      setFeedbackMessage("برای افزودن/حذف از علاقه‌مندی‌ها، ابتدا وارد شوید.");
      return;
    }

    const endpoint = isFavorited ? 'http://127.0.0.1:5000/api/favorites/remove' : 'http://127.0.0.1:5000/api/favorites/add';
    const payload = {
      userId: loggedInUserId,
      content_id: item.id,
      content_type: item.media_type,
      title: item.title,
      thumbnail_url: item.thumbnail,
    };

    try {
      const response = await axios.post(endpoint, payload);
      setFeedbackMessage(response.data.message);
      setIsFavorited(!isFavorited); // Optimistic update
      if (item.media_type === "movie" || item.media_type === "tv") {
        onFavoriteToggled(item.id, item.media_type, !isFavorited);
      }
    } catch (err: any) {
      console.error("Favorite toggle failed:", err);
      setFeedbackMessage(err.response?.data?.error || "خطا در به‌روزرسانی علاقه‌مندی‌ها.");
    } finally {
      // Clear message after some time
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div
      key={item.id}
      className="relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-60 object-cover cursor-pointer"
        onError={(e) => { e.currentTarget.src = getPlaceholderImage(300, 450, "خطای عکس"); }}
        onClick={handleContentClick}
      />
      {item.progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
          <div
            className="h-full bg-[#09f]"
            style={{ width: `${item.progress}%` }}
          ></div>
        </div>
      )}    
      <div className="p-3 flex-grow">
        <h3 className="text-white font-semibold text-lg truncate cursor-pointer"
            onClick={handleContentClick}>
          {item.title}
        </h3>
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
        <div className="mt-3 flex space-x-2">
          <button
            onClick={toggleWatchlist}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition duration-200 flex-1 ${
              isWatchlisted ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {isWatchlisted ? 'حذف از لیست تماشا' : 'افزودن به لیست تماشا'}
          </button>
          <button
            onClick={toggleFavorite}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition duration-200 flex-1 ${
              isFavorited ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {isFavorited ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          </button>
        </div>
        {feedbackMessage && (
          <p className={`mt-2 text-center text-xs ${feedbackMessage.includes('خطا') ? 'text-red-400' : 'text-green-400'}`}>
            {feedbackMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
