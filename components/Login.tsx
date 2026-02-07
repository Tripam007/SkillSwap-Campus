
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [error, setError] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    // Instant generation and transition
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setStep('OTP');
    setShowBanner(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check before processing
      if (file.size > 2 * 1024 * 1024) {
        setError("Image too large. Please use a photo under 2MB for faster loading.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setCustomAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (otp.join('') === generatedOtp) {
      const domain = email.split('@')[1].toLowerCase();
      const commonProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'me.com'];
      
      const collegeName = commonProviders.includes(domain) 
        ? 'Independent Learner' 
        : domain.split('.')[0].toUpperCase() + ' Community';
      
      const hairTypes = ['long01', 'long06', 'short01', 'short05', 'shaved01'];
      const randomHair = hairTypes[Math.floor(Math.random() * hairTypes.length)];
      
      const defaultAvatar = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(email)}&hair=${randomHair}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

      const user: User = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        college: collegeName,
        branch: 'General Studies',
        year: 'Class of 2026',
        avatar: customAvatar || defaultAvatar,
        skills: [],
        reputation: 5.0,
        tradesCompleted: 0
      };

      try {
        // We try to save, but catch errors if the image is too big for the browser's storage quota
        localStorage.setItem('skillswap_user', JSON.stringify(user));
      } catch (storageError) {
        console.warn("Could not save to localStorage (likely quota exceeded due to high-res image). Profile will reset on refresh.");
      }
      
      // Proceed to login even if storage failed (non-blocking)
      onLogin(user);
    } else {
      setError("Invalid code. Please check the simulated notification above.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      {showBanner && step === 'OTP' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-sm bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-10 duration-500 flex items-center justify-between border-b-4 border-indigo-800">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg"><i className="fas fa-comment-dots"></i></div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Simulation Message</p>
              <p className="text-sm font-bold">Your code is: <span className="text-xl tracking-widest bg-white/20 px-2 py-0.5 rounded ml-1">{generatedOtp}</span></p>
            </div>
          </div>
          <button onClick={() => setShowBanner(false)} className="hover:bg-white/10 p-2 rounded-full transition"><i className="fas fa-times"></i></button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden border dark:border-slate-800">
        <div className="text-center space-y-2 relative z-10">
          <div className="bg-indigo-600 text-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-xl">
            <i className="fas fa-repeat"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">SkillSwap Campus</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verify your student identity.</p>
        </div>

        <div className="space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 p-4 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium flex items-start space-x-2 animate-in slide-in-from-left-2">
              <i className="fas fa-exclamation-circle mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Institutional Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"></i>
                  <input required type="email" placeholder="student@university.edu" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl active:scale-95 transition-all">
                Verify Account
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex flex-col items-center space-y-4 py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/20">
                <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-xl transition-transform group-hover:scale-105">
                      <img src={customAvatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${email}`} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <i className="fas fa-camera text-white"></i>
                      </div>
                   </div>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline">
                  {customAvatar ? 'Change Photo' : 'Upload Custom Photo'}
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">OTP Code</label>
                    <button type="button" onClick={() => { setStep('EMAIL'); setShowBanner(false); }} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit Email</button>
                  </div>
                  <div className="flex gap-3">
                    {otp.map((val, i) => (
                      <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} required className="w-full h-16 text-center text-3xl font-black border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" value={val} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} />
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl active:scale-95 transition-all group">
                  <span className="group-active:hidden">Enter Campus</span>
                  <span className="hidden group-active:inline"><i className="fas fa-circle-notch fa-spin"></i> Entering...</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
