import React from 'react';
// مسیردهی اصلاح شد: اگر MoviesPage.tsx در یک ساب‌فولدر مثل 'src/components/' است.
import { type MovieOrSeries, mockUserDashboardData } from '../mockData'; 
import { useNavigate } from 'react-router-dom';

const MoviesPage: React.FC = () => {
  const navigate = useNavigate();

  const allMovies: MovieOrSeries[] = [];
  mockUserDashboardData.forEach(userData => {
    // Collect unique movies from trending, popular, and featuredMovie (if not a series)
    userData.trending.forEach(item => {
      if (!allMovies.some(movie => movie.id === item.id)) allMovies.push(item);
    });
    userData.popular.forEach(item => {
      if (!allMovies.some(movie => movie.id === item.id)) allMovies.push(item);
    });
    userData.myWatchlist.forEach(item => {
        // مطمئن می‌شویم که فقط فیلم‌ها (و نه سریال‌هایی که قسمت دارند) اضافه شوند.
        if (!item.episode && !allMovies.some(movie => movie.id === item.id)) allMovies.push(item);
    });
    if (userData.featuredMovie && !userData.featuredMovie.episode && !allMovies.some(movie => movie.id === userData.featuredMovie?.id)) {
        allMovies.push(userData.featuredMovie);
    }
  });


  const renderMovieCard = (item: MovieOrSeries) => (
    <div
      key={item.id}
      className="relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
      onClick={() => console.log(`Clicked on movie: ${item.title}`)} // شبیه‌سازی هدایت به جزئیات فیلم
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-60 object-cover" // ارتفاع بزرگتر برای جذابیت بصری بهتر
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x450/000/fff?text=No+Image'; }} // تصویر جایگزین در صورت عدم بارگذاری
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
        {allMovies.map(renderMovieCard)}
      </div>
    </div>
  );
};

export default MoviesPage;
