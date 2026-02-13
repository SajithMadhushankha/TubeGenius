import React, { useState, useEffect } from 'react';
import { InputMode, SeoResult } from '../types';
import { generateSeoStrategy, generateSeoContent, researchCompetitors } from '../services/geminiService';
import { extractVideoId, getVideoDetails } from '../services/youtubeService';

interface SeoStudioPageProps {
  result: SeoResult | null;
  onResult: (result: SeoResult) => void;
  initialInput?: string;
  initialMode?: InputMode;
  initialUrl?: string;
}

export const SeoStudioPage: React.FC<SeoStudioPageProps> = ({ result, onResult, initialInput, initialMode, initialUrl }) => {
  const [mode, setMode] = useState<InputMode>(initialMode || InputMode.SCRIPT);
  const [input, setInput] = useState(initialInput || '');
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const [competitorData, setCompetitorData] = useState<string | null>(null);
  const [researching, setResearching] = useState(false);

  useEffect(() => {
    if (initialInput) setInput(initialInput);
    if (initialMode) setMode(initialMode);
    if (initialUrl) setVideoUrl(initialUrl);
  }, [initialInput, initialMode, initialUrl]);

  const handleUrlBlur = async () => {
    if (!videoUrl) return;
    const id = extractVideoId(videoUrl);
    if (id && process.env.REACT_APP_YOUTUBE_API_KEY) {
       try {
         const data = await getVideoDetails(id, process.env.REACT_APP_YOUTUBE_API_KEY!);
         if(data && data.snippet) {
           setInput(prev => `Video Title: ${data.snippet.title}\nDescription: ${data.snippet.description}\n\n${prev}`);
         }
       } catch (e) {
         console.warn("Could not fetch YT metadata", e);
       }
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setCompetitorData(null);

    try {
      setStatusMsg("Thinking... Analyzing keyword intent and entities...");
      const strategy = await generateSeoStrategy(input, mode);
      
      setStatusMsg("Drafting... Generating optimized titles and descriptions...");
      const seoContent = await generateSeoContent(strategy, input);
      onResult(seoContent);

      setResearching(true);
      researchCompetitors(strategy.primaryKeyword).then(data => {
        setCompetitorData(data);
        setResearching(false);
      });

    } catch (e: any) {
      setError(e.message || "An error occurred during generation.");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white shadow-xl animate-fade-in-up">
        <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/20 text-blue-50 text-xs font-semibold backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-300 mr-2 animate-pulse"></span>
                Script Optimization
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                SEO Workspace
            </h1>
            <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                Transform your rough drafts into ranking machines. We analyze search intent to generate high-CTR titles and descriptions.
            </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-20 hidden md:block">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        
        <div className="space-y-4">
          {mode === InputMode.TRANSCRIPT && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source Video URL</label>
              <input 
                type="text" 
                placeholder="https://youtube.com/watch?v=..." 
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                onBlur={handleUrlBlur}
              />
            </div>
          )}
          
          <div>
            <textarea 
              className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y text-slate-700 dark:text-slate-200 placeholder-slate-400 text-lg leading-relaxed"
              placeholder={mode === InputMode.IDEA ? "Describe your video idea..." : "Paste your script or video description here..."}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {statusMsg || 'Analyzing Context...'}
              </>
            ) : (
              'Generate SEO Metadata'
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg border border-red-100 dark:border-red-900 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left Column: Metadata (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Strategy Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                  <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <h3 className="font-bold text-xl text-slate-800 dark:text-white">Strategy Analysis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Keyword</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.strategy?.primaryKeyword}</p>
                   </div>
                   <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Search Intent</p>
                      <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{result.strategy?.searchIntent}</p>
                   </div>
                </div>
              </div>

              {/* Research Data */}
              {(researching || competitorData) && (
                 <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/30">
                   <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                     <span className="text-xl">🔍</span> Competitor Intel
                   </h3>
                   {researching ? (
                     <div className="flex items-center gap-3 text-orange-600 dark:text-orange-300">
                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                       Scanning YouTube Search results...
                     </div>
                   ) : (
                     <div className="prose prose-sm dark:prose-invert max-w-none text-orange-900 dark:text-orange-100 whitespace-pre-wrap">
                       {competitorData}
                     </div>
                   )}
                 </div>
              )}

              {/* Titles */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white px-2">High-CTR Titles</h3>
                {result.titles.map((title, i) => (
                  <div key={i} className="group relative p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex justify-between items-center"
                       onClick={() => navigator.clipboard.writeText(title)}>
                    <div className="pr-10">
                       <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{title}</p>
                       <div className="flex gap-3 mt-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${title.length > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{title.length} chars</span>
                          {i === 0 && <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">Recommended</span>}
                       </div>
                    </div>
                    <button className="text-slate-300 group-hover:text-blue-500 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                       </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white px-2">Description Options</h3>
                {result.descriptions.map((desc, i) => (
                  <div key={i} className="relative p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition-all">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</pre>
                    <button 
                      onClick={() => navigator.clipboard.writeText(desc)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                       </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Tags & Extra (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
               
               {/* Tags Card */}
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Optimized Tags</h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(result.tags.join(','))}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full border border-slate-200 dark:border-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-3">Hashtags</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {result.hashtags.map((tag, i) => (
                      <span key={i} className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Thumbnail Prompt</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4">
                      {result.thumbnailPrompt.substring(0, 100)}...
                    </p>
                  </div>
               </div>
            </div>

          </div>
      )}
    </div>
  );
};