import React, { useState, useEffect } from 'react';
import { extractVideoId, getCaptionsList, downloadCaptionTrack } from '../services/youtubeService';

interface TranscriptPageProps {
  initialUrl?: string;
}

export const TranscriptPage: React.FC<TranscriptPageProps> = ({ initialUrl }) => {
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [transcriptText, setTranscriptText] = useState('');
  const [error, setError] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    if (initialUrl) setVideoUrl(initialUrl);
  }, [initialUrl]);

  const handleFetchList = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }
    if (!accessToken) {
        setShowTokenInput(true);
        setError("Please provide a valid OAuth2 Access Token (with caption scopes) to fetch private caption data.");
        return;
    }

    setLoading(true);
    setError('');
    setCaptions([]);
    setTranscriptText('');

    try {
      const data = await getCaptionsList(videoId, accessToken);
      if (data.items) {
        setCaptions(data.items);
      } else {
        setError("No captions found or permission denied.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (captionId: string) => {
    try {
      const text = await downloadCaptionTrack(captionId, accessToken);
      setTranscriptText(text);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-12 text-white shadow-xl animate-fade-in-up">
        <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/20 text-emerald-50 text-xs font-semibold backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-300 mr-2 animate-pulse"></span>
                Content Extraction
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Transcript Generator
            </h1>
            <p className="text-emerald-100 text-lg max-w-xl leading-relaxed">
                Download accurate captions directly from your YouTube videos for repurposing, translation, or analysis.
            </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-20 hidden md:block">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
           <span className="block text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50">
            ⚠️ <strong>Notice:</strong> YouTube API generally restricts downloading captions to videos <strong>you own or have edit access to</strong>. 
            For public videos you don't own, third-party scraping services are required (not included in this API-compliant demo).
          </span>
        </p>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">YouTube Video URL</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
            />
            <button 
              onClick={handleFetchList}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Get Tracks'}
            </button>
          </div>
        </div>

        {showTokenInput && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <strong>Demo Mode:</strong> To use the Official YouTube Data API for captions, you need an OAuth Access Token with `force-ssl` or `captions` scope.
                    In a production app, this would be a "Sign In with Google" button.
                </p>
                <input 
                    type="password" 
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="Paste OAuth Access Token here..."
                    className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
            </div>
        )}

        {error && <div className="text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/50">{error}</div>}
      </div>

      {captions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Available Caption Tracks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-medium">
                <tr>
                  <th className="p-3">Language</th>
                  <th className="p-3">Track Kind</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {captions.map(track => (
                  <tr key={track.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-medium">{track.snippet.language}</td>
                    <td className="p-3">{track.snippet.trackKind}</td>
                    <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${track.snippet.status === 'serving' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}`}>
                            {track.snippet.status}
                        </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleDownload(track.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {transcriptText && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Transcript Output</h3>
            <button 
                onClick={() => navigator.clipboard.writeText(transcriptText)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
                Copy to Clipboard
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto h-64 text-xs font-mono whitespace-pre-wrap border border-slate-700">
            {transcriptText}
          </pre>
        </div>
      )}
    </div>
  );
};