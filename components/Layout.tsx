import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'seo' | 'idea' | 'thumbnail' | 'transcript';
  onTabChange: (tab: 'home' | 'seo' | 'idea' | 'thumbnail' | 'transcript') => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, theme, setTheme }) => {
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 dark:bg-black text-white flex-shrink-0 flex flex-col z-20">
        <div className="p-6 border-b border-slate-700 dark:border-slate-800 cursor-pointer" onClick={() => onTabChange('home')}>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">TubeGenius</h1>
          <p className="text-xs text-slate-400 mt-1">AI Creator Studio</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => onTabChange('home')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'home' 
                ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
                : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => onTabChange('seo')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'seo' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Script SEO</span>
          </button>

          <button
            onClick={() => onTabChange('idea')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'idea' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="font-medium">Idea Generator</span>
          </button>

          <button
            onClick={() => onTabChange('thumbnail')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'thumbnail' 
                ? 'bg-pink-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Thumbnail Studio</span>
          </button>
          
          <button
            onClick={() => onTabChange('transcript')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'transcript' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Transcript Gen</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700 dark:border-slate-800">
          <div className="flex bg-slate-800 dark:bg-slate-900 rounded-lg p-1">
            {['light', 'system', 'dark'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className={`flex-1 py-1 rounded-md text-xs capitalize flex justify-center items-center ${
                  theme === t 
                    ? 'bg-slate-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`${t} mode`}
              >
                {t === 'light' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {t === 'dark' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                {t === 'system' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 pt-2">
          <div className="text-xs text-slate-500">
            Powered by Gemini API<br/>
            & Google Cloud
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
         {children}
      </main>
    </div>
  );
};