import React, { useRef, useEffect, useState } from 'react';

interface CanvasThumbnailProps {
  title: string;
}

export const CanvasThumbnail: React.FC<CanvasThumbnailProps> = ({ title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(80);
  const [customText, setCustomText] = useState(title);

  useEffect(() => {
    setCustomText(title);
  }, [title]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient Overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap roughly
    const words = customText.split(' ');
    let line = '';
    const lines = [];
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > canvas.width - 100 && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw lines
    const lineHeight = fontSize * 1.2;
    const startY = (canvas.height - (lines.length * lineHeight)) / 2 + (lineHeight / 2);

    lines.forEach((l, i) => {
      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.fillText(l, canvas.width / 2, startY + (i * lineHeight));
    });
    
    // Reset shadow
    ctx.shadowColor = "transparent";
    
    // Add "NEW" badge or similar if wanted (Mock)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(50, 50, 150, 60);
    ctx.fillStyle = "white";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("VIDEO", 125, 80);

  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgColor, textColor, fontSize, customText]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'thumbnail.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg flex flex-wrap gap-4 items-end border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-8 w-16 cursor-pointer rounded border border-slate-300" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
          <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-8 w-16 cursor-pointer rounded border border-slate-300" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Font Size</label>
          <input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="h-8 w-20 px-2 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600" />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Overlay</label>
          <input type="text" value={customText} onChange={e => setCustomText(e.target.value)} className="w-full h-8 px-2 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600" />
        </div>
      </div>

      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-600">
        <canvas 
          ref={canvasRef} 
          width={1280} 
          height={720} 
          className="w-full h-full object-contain"
        />
      </div>

      <button onClick={download} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Template PNG
      </button>
    </div>
  );
};