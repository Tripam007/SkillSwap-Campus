
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const AIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO' | 'EDIT'>('IMAGE');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ aspectRatio: '1:1', size: '1K' });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (activeTab === 'IMAGE') {
        const url = await geminiService.generateImage(prompt, config.aspectRatio, config.size);
        setResult(url);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <i className="fas fa-wand-magic-sparkles text-indigo-600"></i> AI Studio
          </h2>
          
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            {(['IMAGE', 'VIDEO', 'EDIT'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Describe your vision</label>
              <textarea 
                className="w-full mt-2 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none"
                rows={4}
                placeholder={activeTab === 'IMAGE' ? "A hyper-realistic study desk with floating neon holograms..." : "Animate these notes with swirling cosmic dust..."}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            {activeTab === 'IMAGE' && (
              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  onChange={e => setConfig({ ...config, aspectRatio: e.target.value })}
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Cinema</option>
                  <option value="9:16">9:16 Reel</option>
                  <option value="21:9">21:9 Ultra</option>
                </select>
                <select 
                  className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  onChange={e => setConfig({ ...config, size: e.target.value })}
                >
                  <option value="1K">1K Quality</option>
                  <option value="2K">2K Pro</option>
                  <option value="4K">4K Ultra</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-bolt mr-2"></i>}
              {loading ? 'Processing...' : `Generate ${activeTab}`}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 min-h-[500px] bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 relative overflow-hidden">
        {result ? (
          <div className="relative w-full h-full flex items-center justify-center group">
            <img src={result} alt="Generated" className="max-w-full max-h-[600px] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-xl shadow-xl hover:scale-110 transition"><i className="fas fa-download"></i></button>
               <button className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-xl shadow-xl hover:scale-110 transition text-red-500" onClick={() => setResult(null)}><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 dark:text-slate-800 text-4xl">
               <i className={`fas ${activeTab === 'IMAGE' ? 'fa-image' : 'fa-video'}`}></i>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Creative Input</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudio;
