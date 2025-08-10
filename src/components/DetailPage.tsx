import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { type MovieOrSeries, getPlaceholderImage, getTmdbImageUrl, mapGenreIdsToNames } from '../mockData';
import axios from 'axios';
import Loader from './Loader';

interface DetailPageProps {
  loggedInUserId: number | null;
}

const DetailPage: React.FC<DetailPageProps> = ({ loggedInUserId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contentType = queryParams.get('type') || 'movie';

  const [content, setContent] = useState<MovieOrSeries | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);
  const [continueWatchingMessage, setContinueWatchingMessage] = useState<string | null>(null);
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null); // New state for favorite messages


  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!id) {
        setError("شناسه محتوا نامعتبر است.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setWatchlistMessage(null); 
        setContinueWatchingMessage(null);
        setFavoriteMessage(null); // Clear favorite messages
        
        const response = await axios.get(`http://127.0.0.1:5000/api/tmdb/details/${id}?type=${contentType}`);
        const data = response.data;

        const mappedContent: MovieOrSeries = {
          id: String(data.id),
          title: data.title || data.name || 'N/A',
          thumbnail: getTmdbImageUrl(data.poster_path, 'w500', 300, 450),
          poster: getTmdbImageUrl(data.backdrop_path, 'original', 1200, 600),
          genre: mapGenreIdsToNames(data.genres?.map((g: any) => g.id), contentType === 'tv' ? 'tv' : 'movie'),
          year: new Date(data.release_date || data.first_air_date || '0').getFullYear() || 0,
          rating: data.vote_average ? parseFloat(data.vote_average.toFixed(1)) : 0,
          description: data.overview || 'خلاصه داستانی موجود نیست.',
          director: data.credits?.crew?.find((crew: any) => crew.job === 'Director')?.name || 'نامشخص',
          cast: data.credits?.cast?.slice(0, 5).map((cast: any) => cast.name) || [],
          season: contentType === 'tv' && data.last_episode_to_air ? `فصل ${data.last_episode_to_air.season_number}` : undefined,
          episode: contentType === 'tv' && data.last_episode_to_air ? `قسمت ${data.last_episode_to_air.episode_number}` : undefined,
          media_type: contentType === 'tv' ? 'tv' : 'movie',
        };
        setContent(mappedContent);
      } catch (err: any) {
        console.error("Failed to fetch content details:", err);
        setError("خطا در بارگذاری جزئیات محتوا. لطفاً مطمئن شوید ID و نوع (فیلم/سریال) صحیح هستند.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, contentType]);

  const handleAddToWatchlist = async () => {
    if (!content) {
      setWatchlistMessage("محتوایی برای افزودن انتخاب نشده است.");
      return;
    }
    if (!loggedInUserId) {
      setWatchlistMessage("برای افزودن به لیست تماشا، ابتدا وارد شوید.");
      return;
    }

    setWatchlistMessage(null); 
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/watchlist/add', {
        userId: loggedInUserId, 
        content_id: content.id,
        content_type: content.media_type,
        title: content.title,
        thumbnail_url: content.thumbnail, 
      });
      setWatchlistMessage(response.data.message);
    } catch (err: any) {
      console.error("Failed to add to watchlist:", err);
      setWatchlistMessage(err.response?.data?.error || "خطا در افزودن به لیست تماشا.");
    }
  };

  const handlePlayContent = async () => {
    if (!content) {
      setContinueWatchingMessage("محتوایی برای پخش انتخاب نشده است.");
      return;
    }
    if (!loggedInUserId) {
      setContinueWatchingMessage("برای شروع تماشا، ابتدا وارد شوید.");
      return;
    }

    setContinueWatchingMessage(null);
    try {
      const initialProgress = 5; 
      const response = await axios.post('http://127.0.0.1:5000/api/continue_watching/update', {
        userId: loggedInUserId,
        content_id: content.id,
        content_type: content.media_type,
        title: content.title,
        thumbnail_url: content.thumbnail,
        progress: initialProgress,
      });
      setContinueWatchingMessage(response.data.message + ` (پیشرفت: ${initialProgress}%)`);

      console.log(`Playing: ${content.title} - Type: ${content.media_type} - Initial Progress: ${initialProgress}%`);

    } catch (err: any) {
      console.error("Failed to update continue watching:", err);
      setContinueWatchingMessage(err.response?.data?.error || "خطا در شروع/ادامه تماشا.");
    }
  };

  const handleAddToFavorites = async () => {
    if (!content) {
      setFavoriteMessage("محتوایی برای افزودن انتخاب نشده است.");
      return;
    }
    if (!loggedInUserId) {
      setFavoriteMessage("برای افزودن به علاقه‌مندی‌ها، ابتدا وارد شوید.");
      return;
    }

    setFavoriteMessage(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/favorites/add', {
        userId: loggedInUserId,
        content_id: content.id,
        content_type: content.media_type,
        title: content.title,
        thumbnail_url: content.thumbnail,
      });
      setFavoriteMessage(response.data.message);
    } catch (err: any) {
      console.error("Failed to add to favorites:", err);
      setFavoriteMessage(err.response?.data?.error || "خطا در افزودن به علاقه‌مندی‌ها.");
    }
  };


  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-red-400 text-center">
        <h2 className="text-3xl font-extrabold text-red-500">خطا</h2>
        <p className="text-lg">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت
        </button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="w-full max-w-4xl p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white text-center">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">محتوایی یافت نشد</h2>
        <p className="text-lg">متأسفانه جزئیات این مورد در دسترس نیست.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
        >
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white overflow-hidden">
      {/* Background Poster / Backdrop */}
      {content.poster && (
        <div className="absolute inset-0 z-0">
          <img
            src={content.poster}
            alt={content.title}
            className="w-full h-full object-cover opacity-30"
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(1200, 600, "خطای عکس"); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative z-10 p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Thumbnail/Poster on left */}
        <div className="flex-shrink-0">
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-56 h-80 object-cover rounded-lg shadow-xl border border-gray-700"
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(224, 320, "خطای عکس"); }}
          />
        </div>

        {/* Details on right */}
        <div className="flex-grow">
          <h1 className="text-4xl font-extrabold text-[#09f] mb-3">{content.title}</h1>
          <div className="flex items-center text-gray-300 text-lg mb-4 space-x-4">
            <span>{content.genre}</span>
            <span>|</span>
            <span>{content.year}</span>
            {content.season && content.episode && (
              <>
                <span>|</span>
                <span>{content.season} {content.episode}</span>
              </>
            )}
            {content.rating && (
              <>
                <span>|</span>
                <span className="flex items-center text-yellow-400">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                  {content.rating} / 10
                </span>
              </>
            )}
          </div>

          {content.director && (
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold text-gray-300">کارگردان:</span> {content.director}
            </p>
          )}
          {content.cast && content.cast.length > 0 && (
            <p className="text-gray-400 text-sm mb-4">
              <span className="font-semibold text-gray-300">بازیگران:</span> {content.cast.join(', ')}
            </p>
          )}

          {content.description && (
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {content.description}
            </p>
          )}

          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlayContent}
              className="px-6 py-3 bg-[#09f] text-white rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 ml-2 transform rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
              تماشای فیلم
            </button>
            <button 
              onClick={handleAddToWatchlist}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              افزودن به لیست تماشا
            </button>
            <button 
              onClick={handleAddToFavorites} // New button for favorites
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
              افزودن به علاقه‌مندی‌ها
            </button>
          </div>
          {watchlistMessage && (
            <p className={`mt-4 text-center ${watchlistMessage.includes("خطا") ? "text-red-400" : "text-green-400"}`}>
              {watchlistMessage}
            </p>
          )}
          {continueWatchingMessage && (
            <p className={`mt-2 text-center ${continueWatchingMessage.includes("خطا") ? "text-red-400" : "text-green-400"}`}>
              {continueWatchingMessage}
            </p>
          )}
          {favoriteMessage && ( // Display favorite messages
            <p className={`mt-2 text-center ${favoriteMessage.includes("خطا") ? "text-red-400" : "text-green-400"}`}>
              {favoriteMessage}
            </p>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
