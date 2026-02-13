import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { SeoStudioPage } from './pages/SeoStudioPage';
import { IdeaGeneratorPage } from './pages/IdeaGeneratorPage';
import { ThumbnailPage } from './pages/ThumbnailPage';
import { TranscriptPage } from './pages/TranscriptPage';
import { ChatWidget } from './components/ChatWidget';
import { SeoResult, InputMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'seo' | 'idea' | 'thumbnail' | 'transcript'>('home');
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);
  
  // Shared Data passed from Landing Page
  const [sharedInput, setSharedInput] = useState('');
  const [sharedMode, setSharedMode] = useState<InputMode>(InputMode.IDEA);
  const [sharedUrl, setSharedUrl] = useState('');

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle system preference changes if in system mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        if (mediaQuery.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleLandingNavigation = (tab: 'seo' | 'thumbnail' | 'transcript', data?: { input?: string, mode?: InputMode, url?: string }) => {
    if (data) {
      if (data.input) setSharedInput(data.input);
      if (data.mode) setSharedMode(data.mode);
      if (data.url) setSharedUrl(data.url);
      
      // If user selected IDEA mode, route to IDEA tab instead of SEO tab
      if (data.mode === InputMode.IDEA && tab === 'seo') {
        setActiveTab('idea');
        return;
      }
    }
    setActiveTab(tab);
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      >
        {activeTab === 'home' && (
          <LandingPage onNavigate={handleLandingNavigation} />
        )}

        {activeTab === 'seo' && (
          <SeoStudioPage 
            result={seoResult} 
            onResult={(res) => {
              setSeoResult(res);
            }}
            initialInput={sharedMode === InputMode.SCRIPT ? sharedInput : ''}
            initialMode={InputMode.SCRIPT}
            initialUrl={sharedUrl}
          />
        )}

        {activeTab === 'idea' && (
           <IdeaGeneratorPage 
             onResult={(res) => setSeoResult(res)}
             initialInput={sharedMode === InputMode.IDEA ? sharedInput : ''}
           />
        )}

        {activeTab === 'thumbnail' && (
          <ThumbnailPage 
            initialTitle={seoResult?.titles?.[0] || ''}
            initialPrompt={seoResult?.thumbnailPrompt || sharedInput} 
          />
        )}
        
        {activeTab === 'transcript' && (
          <TranscriptPage initialUrl={sharedUrl} />
        )}
      </Layout>
      <ChatWidget />
    </>
  );
};

export default App;