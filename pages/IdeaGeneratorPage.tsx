import React, { useState, useEffect } from 'react';
import { InputMode, SeoResult } from '../types';
import { generateSeoStrategy, generateSeoContent, researchCompetitors } from '../services/geminiService';

interface IdeaGeneratorPageProps {
  onResult: (result: SeoResult) => void;
  initialInput?: string;
}

export const IdeaGeneratorPage: React.FC<IdeaGeneratorPageProps> = ({ onResult, initialInput }) => {
  const [input, setInput] = useState(initialInput || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [result, setResult] = useState<SeoResult | null>(null);
  const [competitorData, setCompetitorData] = useState<string | null>(null);

  useEffect(() => {
    if (initialInput) setInput(initialInput);
  }, [initialInput]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCompetitorData(null);

    try {
      setStatusMsg("Brainstorming... Expanding your idea into a concrete strategy...");
      const strategy = await generateSeoStrategy(input, InputMode.IDEA, "Focus on trending potential and viral hooks.");
      
      setStatusMsg("Creating Metadata... Generating click-worthy titles and descriptions...");
      const seoContent = await generateSeoContent(strategy, input);
      setResult(seoContent);
      onResult(seoContent);

      researchCompetitors(strategy.primaryKeyword).then(data => {
        setCompetitorData(data);
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-violet-600 p-8 md:p-12 text-white shadow-xl animate-fade-in-up">
        <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/20 text-purple-50 text-xs font-semibold backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-300 mr-2 animate-pulse"></span>
                Brainstorming Mode
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Idea Generator
            </h1>
            <p className="text-purple-100 text-lg max-w-xl leading-relaxed">
                Stuck? Turn a simple keyword or topic into a fully fleshed-out video plan with viral potential.
            </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-20 hidden md:block">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
           <label className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">What's on your mind?</label>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Enter a niche, a question, or a rough topic. We'll handle the rest.</p>
           <textarea 
              className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-y text-slate-700 dark:text-slate-200 placeholder-slate-400 text-lg"
              placeholder="e.g. I want to make a video about growing tomatoes in winter..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
        </div>

        <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-900/20 transition-all hover:-translate-y-1 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {statusMsg || 'Brainstorming...'}
              </>
            ) : (
              <>
                <span className="text-xl">💡</span> Generate Video Plan
              </>
            )}
        </button>

        {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg border border-red-100 dark:border-red-900 text-sm">
              {error}
            </div>
        )}
      </div>

      {/* Results Display (Reused logic for consistency) */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            <div className="lg:col-span-8 space-y-6">
              
              {/* Strategy Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-32 h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                </div>
                <div className="flex items-center gap-3 mb-4 text-purple-600 dark:text-purple-400 relative z-10">
                  <h3 className="font-bold text-xl text-slate-800 dark:text-white">Concept Strategy</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Winning Keyword</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.strategy?.primaryKeyword}</p>
                   </div>
                   <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Intent</p>
                      <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{result.strategy?.searchIntent}</p>
                   </div>
                </div>
              </div>

              {/* Research Data */}
              {competitorData && (
                 <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/30">
                   <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                     <span className="text-xl">🔍</span> Market Research
                   </h3>
                   <div className="prose prose-sm dark:prose-invert max-w-none text-orange-900 dark:text-orange-100 whitespace-pre-wrap">
                       {competitorData}
                   </div>
                 </div>
              )}

              {/* Titles */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white px-2">Proposed Titles</h3>
                {result.titles.map((title, i) => (
                  <div key={i} className="group relative p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer flex justify-between items-center"
                       onClick={() => navigator.clipboard.writeText(title)}>
                    <div className="pr-10">
                       <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{title}</p>
                    </div>
                    <button className="text-slate-300 group-hover:text-purple-500 transition-colors">
                       Copy
                    </button>
                  </div>
                ))}
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white px-2">Drafted Descriptions</h3>
                {result.descriptions.map((desc, i) => (
                  <div key={i} className="relative p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition-all">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</pre>
                    <button 
                      onClick={() => navigator.clipboard.writeText(desc)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-purple-500 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors"
                      title="Copy"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Keywords & Tags</h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(result.tags.join(','))}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
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

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Thumbnail Idea</h4>
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