import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllMockContent, type MovieOrSeries } from '../mockData';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const navigate = useNavigate();
  const allContent = getAllMockContent(); // Get all mock content

  const content: MovieOrSeries | undefined = allContent.find(item => item.id === id);

  if (!content) {
    return (
      <div className="w-full max-w-4xl p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm text-white text-center">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">خطا</h2>
        <p className="text-lg">محتوای مورد نظر یافت نشد.</p>
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
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
            className="w-full h-full object-cover opacity-30" // Subtle opacity
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600/000/fff?text=No+Image'; }}
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
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/224x320/000/fff?text=No+Image'; }}
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
            <button className="px-6 py-3 bg-[#09f] text-white rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 flex items-center">
              <svg className="w-5 h-5 ml-2 transform rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
              تماشای فیلم
            </button>
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-200 flex items-center">
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              افزودن به لیست تماشا
            </button>
          </div>

          <button
            onClick={() => navigate(-1)} // Go back to the previous page
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
