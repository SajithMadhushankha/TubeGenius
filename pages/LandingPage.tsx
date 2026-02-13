import React, { useState } from 'react';
import { InputMode } from '../types';

interface LandingPageProps {
  onNavigate: (tab: 'seo' | 'thumbnail' | 'transcript', data?: { input?: string, mode?: InputMode, url?: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mode] = useState<InputMode>(InputMode.IDEA);
  const input = '';

  const handleAction = (action: 'seo' | 'thumbnail' | 'transcript') => {
    onNavigate(action, {
      input,
      mode, 
      url: undefined
    });
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI SEO improve my views?",
      answer: "Our engine analyzes top-performing keywords in your niche and structures your metadata (titles, tags, descriptions) to match search intent, increasing your chances of ranking in search and suggested videos."
    },
    {
      question: "Can I generate thumbnails for free?",
      answer: "Yes! You can use our 'Template Builder' for free forever. The 'AI Generator' uses advanced models to create unique images based on your prompts."
    },
    {
      question: "Do I need technical skills?",
      answer: "Not at all. TubeGenius is designed for creators of all levels. Just describe your video idea, and we handle the technical optimization."
    },
    {
      question: "Is this compliant with YouTube policies?",
      answer: "100%. We focus on white-hat SEO strategies—relevant keywords, accurate descriptions, and safe-for-work content generation."
    }
  ];

  return (
    <div className="relative min-h-full pb-20 overflow-hidden font-sans">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateX(5deg) rotateY(-5deg); }
          100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-reverse 7s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .dark .glass-panel {
          background: rgba(30, 41, 59, 0.7);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-500/10 dark:bg-pink-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24 pt-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[500px]">
          <div className="md:w-1/2 space-y-8 z-10 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              v2.0 Now Available with Gemini AI
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
              GO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 text-glow">
                VIRAL
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-light">
              Stop guessing. Start ranking. <br/>
              The AI-powered toolkit that turns your raw ideas into <span className="font-semibold text-slate-900 dark:text-white">YouTube Gold</span>.
            </p>
            <div className="flex gap-4">
               <button onClick={() => handleAction('seo')} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                 Start Creating
               </button>
               <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-full font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                 Learn More
               </button>
            </div>
          </div>

          {/* 3D Animated Hero Visual */}
          <div className="md:w-1/2 flex justify-center items-center perspective-1000 h-[500px]">
            <div className="relative w-80 h-80 preserve-3d animate-float">
              {/* Floating Orbit Rings */}
              <div className="absolute inset-[-50px] border-2 border-dashed border-blue-500/20 rounded-full animate-spin-slow preserve-3d" style={{transform: 'rotateX(70deg)'}}></div>
              <div className="absolute inset-[-20px] border-2 border-dashed border-purple-500/20 rounded-full animate-spin-slow preserve-3d" style={{transform: 'rotateX(70deg) rotateY(45deg)', animationDirection: 'reverse'}}></div>

              {/* Main Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center border border-slate-700/50 backdrop-blur-xl z-20 transform translate-z-10">
                 <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform hover:scale-110 transition-transform duration-500">
                    <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                 </div>
                 <div className="text-center px-6">
                    <div className="text-3xl font-bold text-white mb-1">1M+</div>
                    <div className="text-sm text-slate-400 uppercase tracking-widest">Views Generated</div>
                 </div>
              </div>

              {/* Floating Elements behind/around */}
              <div className="absolute -right-16 top-0 p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-xl animate-float-delayed z-30">
                 <span className="text-3xl">🚀</span>
              </div>
              <div className="absolute -left-12 bottom-20 p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-xl animate-float z-30" style={{animationDelay: '2s'}}>
                 <span className="text-3xl">📈</span>
              </div>
              <div className="absolute -right-4 bottom-[-40px] p-3 bg-blue-600 text-white rounded-xl shadow-xl animate-float-delayed z-30" style={{animationDelay: '1s'}}>
                 <span className="font-bold text-sm">#1 Trending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid (Features) */}
        <div id="features" className="py-10">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">Power Up Your Channel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cards with hover effects */}
              {[
                  {
                      id: 'seo',
                      title: 'Smart SEO Strategy',
                      desc: 'Generate high-ranking titles, descriptions, and tags tailored to your niche.',
                      icon: (
                        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      ),
                      color: 'blue'
                  },
                  {
                      id: 'thumbnail',
                      title: 'Thumbnail Studio',
                      desc: 'Create click-worthy thumbnails with AI generation or customizable templates.',
                      icon: (
                        <svg className="w-12 h-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      ),
                      color: 'pink'
                  },
                  {
                      id: 'transcript',
                      title: 'Transcript Tool',
                      desc: 'Extract captions and timestamps from existing videos for repurposing.',
                      icon: (
                        <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      ),
                      color: 'emerald'
                  }
              ].map((feature) => (
                  <button 
                    key={feature.id}
                    onClick={() => handleAction(feature.id as any)}
                    className="group relative p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-transparent text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                  >
                      <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative z-10">
                          <div className={`mb-6 p-4 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300`}>
                              {feature.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                             {feature.desc}
                          </p>
                          <div className={`mt-6 flex items-center text-${feature.color}-600 dark:text-${feature.color}-400 font-bold group-hover:gap-2 transition-all`}>
                              Try it now 
                              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                      </div>
                  </button>
              ))}
            </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
               {faqs.map((faq, index) => (
                   <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
                       <button 
                         onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                         className="w-full flex justify-between items-center p-6 text-left"
                       >
                           <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{faq.question}</span>
                           <span className={`transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                             <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                           </span>
                       </button>
                       <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                           <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                               {faq.answer}
                           </p>
                       </div>
                   </div>
               ))}
            </div>
        </div>

      </div>
    </div>
  );
};