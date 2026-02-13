import React, { useState, useEffect } from 'react';
import { generateThumbnailImage } from '../services/geminiService';
import { CanvasThumbnail } from '../components/CanvasThumbnail';

interface ThumbnailPageProps {
  initialTitle: string;
  initialPrompt: string;
}

export const ThumbnailPage: React.FC<ThumbnailPageProps> = ({ initialTitle, initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [title, setTitle] = useState(initialTitle);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  // Update local state if props change (e.g. re-generation in SEO tab)
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  const handleGenerateAI = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const images = await generateThumbnailImage(prompt, '2K');
      setGeneratedImages(images);
    } catch (e) {
      alert("Failed to generate images");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 to-rose-600 p-8 md:p-12 text-white shadow-xl animate-fade-in-up">
        <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/20 text-pink-50 text-xs font-semibold backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-pink-300 mr-2 animate-pulse"></span>
                Visual Design
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Thumbnail Studio
            </h1>
            <p className="text-pink-100 text-lg max-w-xl leading-relaxed">
                Create eye-catching, high-CTR thumbnails using Gemini's image generation or our custom builder.
            </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-20 hidden md:block">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: AI Generation */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-pink-500">✨</span> AI Generator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image Prompt</label>
                <textarea
                  className="w-full text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[120px] focus:ring-2 focus:ring-pink-500 outline-none resize-y placeholder-slate-400"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your thumbnail... (e.g., A shocked person holding a burning laptop, neon background, high contrast, 4k)"
                />
              </div>
              
              <button 
                onClick={handleGenerateAI}
                disabled={generating || !prompt}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating 2K Images...
                  </>
                ) : (
                  'Generate Variations'
                )}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-6">
            {generatedImages.length > 0 ? (
              generatedImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                  <img src={img} alt={`Generated ${idx}`} className="w-full h-auto" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a href={img} download={`thumbnail-ai-${Date.now()}-${idx}.png`} className="bg-white text-black px-4 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                      Download
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>AI Results will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Manual Builder */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
             <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-blue-500">🛠️</span> Template Builder
            </h3>
            
            <div className="mb-6">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Title / Overlay Text</label>
               <input 
                 type="text" 
                 value={title} 
                 onChange={e => setTitle(e.target.value)}
                 className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                 placeholder="ENTER TEXT HERE"
               />
            </div>

            <CanvasThumbnail title={title || "YOUR TEXT HERE"} />
          </div>
        </div>

      </div>
    </div>
  );
};