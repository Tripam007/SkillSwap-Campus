
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { audioUtils } from '../services/geminiService';

const LiveAssistant: React.FC = () => {
  const [active, setActive] = useState(false);
  const [thinking, setThinking] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await audioUtils.decodeAudioData(audioUtils.decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a helpful campus assistant. Keep responses concise and friendly.'
        }
      });

      sessionRef.current = await sessionPromise;
      setActive(true);
    } catch (e) { console.error(e); }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setActive(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      <div className={`absolute bottom-full right-0 mb-6 w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-2 border-indigo-500/20 p-6 transition-all duration-500 ${active ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white relative">
            <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
            <i className="fas fa-microphone text-2xl"></i>
          </div>
          <h3 className="font-black text-slate-900 dark:text-white">Live AI Assistant</h3>
          <p className="text-xs text-slate-500">Ask anything about campus life, study resources, or trade advice.</p>
          <div className="flex gap-2 w-full">
            <div className="flex-1 h-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600 w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          <button onClick={stopSession} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline">End Session</button>
        </div>
      </div>

      <button 
        onClick={() => active ? stopSession() : startSession()}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 ${active ? 'bg-red-500 rotate-45' : 'bg-indigo-600 shadow-indigo-500/50'}`}
      >
        <i className={`fas ${active ? 'fa-times' : 'fa-headset'} text-xl`}></i>
      </button>
    </div>
  );
};

export default LiveAssistant;
