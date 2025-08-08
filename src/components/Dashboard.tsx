import React from 'react';
import { mockUserDashboardData, type MovieOrSeries, type UserDashboardData } from '../mockData';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface DashboardProps {
  userEmail: string; // The logged-in user's email for data lookup
  userName: string; // The user's name to display in the header
  onLogout: () => void; // Function to handle logout
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, userName, onLogout }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const userData: UserDashboardData | undefined = mockUserDashboardData.find(
    (user) => user.email === userEmail
  );

  // State for dark mode toggle (applied to body class)
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      if (savedMode) {
        return savedMode === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode]);

  // Handler for navigation links
  const handleNavLinkClick = (path: string) => {
    navigate(path); // Use navigate to change route
  };

  // Handler for "مشاهده همه" links (placeholder for now, can be updated to specific pages later)
  const handleViewAllClick = (section: string) => {
    console.log(`Viewing all ${section} content...`);
    // In a real app, you might navigate to a filtered list page
  };

  if (!userData) {
    return (
      <div className="text-white text-center p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-[#09f] mb-4">داشبورد</h2>
        <p className="text-lg">اطلاعات کاربری یافت نشد.</p>
        <button
          onClick={onLogout}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
        >
          خروج
        </button>
      </div>
    );
  }

  const renderMovieCard = (item: MovieOrSeries) => (
    <div
      key={item.id}
      className="relative flex-shrink-0 w-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
      onClick={() => console.log(`Clicked on content: ${item.title}`)} // Placeholder for content details page
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-32 object-cover"
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x180/000/fff?text=No+Image'; }}
      />
      {item.progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
          <div
            className="h-full bg-[#09f]"
            style={{ width: `${item.progress}%` }}
          ></div>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
        {item.episode && <p className="text-gray-400 text-xs mt-1">{item.episode}</p>}
        {!item.episode && <p className="text-gray-400 text-xs mt-1">{item.genre} | {item.year}</p>}
        {item.rating && (
          <div className="flex items-center text-yellow-400 text-xs mt-1">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
            </svg>
            {item.rating}
          </div>
        )}
      </div>
    </div>
  );

  const renderRecentlyUpdatedItem = (item: MovieOrSeries) => (
    <div key={item.id} className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-200">
      <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-md object-cover mr-3" 
           onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/000/fff?text=No+Image'; }}/>
      <div className="flex-grow">
        <h4 className="text-white font-semibold text-sm">{item.title}</h4>
        <p className="text-gray-400 text-xs">{item.season} {item.episode}</p>
      </div>
      {item.rating && (
        <div className="flex items-center text-yellow-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
          </svg>
          {item.rating}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex w-full h-full bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 p-6 flex flex-col justify-between border-r border-gray-800">
        <div>
          <div className="text-white text-3xl font-bold mb-10 text-[#09f]">
            <span className="font-inter">Flixio</span>
          </div>
          <nav className="space-y-4">
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/dashboard')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              خانه
            </a>
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/movies')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
              فیلم‌ها
            </a>
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/series')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 11a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4zM2 11a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
              سریال‌ها
            </a>
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/favorites')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              علاقه‌مندی‌ها
            </a>
          </nav>
        </div>
        <div>
          <div className="space-y-4 mb-6">
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/help')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              راهنما
            </a>
            <a href="javascript:void(0)" onClick={() => handleNavLinkClick('/about')} className="flex items-center text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              درباره ما
            </a>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <label htmlFor="dark-mode-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="dark-mode-toggle" 
                  className="sr-only" 
                  checked={isDarkMode} 
                  onChange={() => setIsDarkMode(!isDarkMode)} 
                />
                <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isDarkMode ? 'translate-x-full bg-[#09f]' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm font-medium">حالت تیره</div>
            </label>
          </div>
          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">اشتراک</span>
              <svg className="w-4 h-4 text-[#09f]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </div>
            <p className="text-xs text-gray-400 mt-1">۳۰ روز باقی مانده</p>
          </div>
          <button
            onClick={onLogout}
            className="mt-6 w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
          >
            خروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="جستجوی فیلم‌ها..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[#09f] focus:border-[#09f]"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-300">
              <span className="font-semibold">سلام {userName}</span>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button onClick={() => console.log("Notifications clicked")} className="text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
            </button>
            <button onClick={() => console.log("Settings clicked")} className="text-gray-300 hover:text-[#09f] transition duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.381-.088-.783.007-1.15.158 1.287 1.42 2.062 3.208 2.062 5.17 0 1.962-.775 3.75-2.062 5.17-.367.151-.769.246-1.15.158-.38-.087-.723-.332-.962-.653-.239-.32-.35-.71-.35-1.102a.75.75 0 00-.75-.75.75.75 0 00-.75.75c0 .72.296 1.39.782 1.916.486.526 1.144.86 1.868.995.724.136 1.49.063 2.18-.216.69-.279 1.27-.77 1.71-1.38.44-.61.68-1.31.68-2.07 0-.76-.24-1.46-.68-2.07-.44-.61-.99-1.1-1.71-1.38-.69-.279-1.456-.352-2.18-.216-.381.088-.783.007-1.15.158z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </header>

        {/* Featured Movie/Series */}
        {userData.featuredMovie && (
          <section className="relative w-full h-96 rounded-lg overflow-hidden mb-8 shadow-xl">
            <img
              src={userData.featuredMovie.poster || userData.featuredMovie.thumbnail}
              alt={userData.featuredMovie.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600/000/fff?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white z-10">
              <h3 className="text-4xl font-bold mb-2">{userData.featuredMovie.title}</h3>
              <p className="text-lg mb-2">{userData.featuredMovie.rating} / 10</p>
              <p className="text-sm max-w-md mb-4">{userData.featuredMovie.description}</p>
              <button onClick={() => console.log("Watch movie clicked:", userData.featuredMovie?.title)} className="px-6 py-3 bg-[#09f] text-white rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                تماشای فیلم
              </button>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Trending Section */}
            {userData.trending.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-200">ترندینگ</h3>
                  <a href="javascript:void(0)" onClick={() => handleViewAllClick('Trending')} className="text-[#09f] text-sm hover:underline">مشاهده همه</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.trending.map((item) => (
                    <div key={item.id} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center transform transition-transform hover:scale-[1.02]">
                      <img src={item.thumbnail} alt={item.title} className="w-32 h-24 object-cover flex-shrink-0" 
                           onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x180/000/fff?text=No+Image'; }}/>
                      <div className="p-3 flex-grow">
                        <h4 className="text-white font-semibold text-base truncate">{item.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{item.genre} | {item.year}</p>
                        {item.rating && (
                          <div className="flex items-center text-yellow-400 text-sm mt-1">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                            {item.rating} / 10
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Section (similar to Trending) */}
            {userData.popular.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-200">محبوب</h3>
                  <a href="javascript:void(0)" onClick={() => handleViewAllClick('Popular')} className="text-[#09f] text-sm hover:underline">مشاهده همه</a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userData.popular.map(renderMovieCard)}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar for Continue Watching & Recently Updated */}
          <div className="lg:col-span-1 space-y-8">
            {/* Continue Watching Section */}
            {userData.continueWatching.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-200">ادامه تماشا</h3>
                  <a href="javascript:void(0)" onClick={() => handleViewAllClick('Continue Watching')} className="text-[#09f] text-sm hover:underline">مشاهده همه</a>
                </div>
                <div className="space-y-4">
                  {userData.continueWatching.map(renderMovieCard)}
                </div>
              </section>
            )}

            {/* Recently Updated Series Section */}
            {userData.recentlyUpdated.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-200">سریال‌های اخیراً به‌روز شده</h3>
                  <a href="javascript:void(0)" onClick={() => handleViewAllClick('Recently Updated Series')} className="text-[#09f] text-sm hover:underline">مشاهده همه</a>
                </div>
                <div className="space-y-3">
                  {userData.recentlyUpdated.map(renderRecentlyUpdatedItem)}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
