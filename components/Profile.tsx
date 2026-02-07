
import React, { useRef, useState } from 'react';
import { User, Listing } from '../types';

interface ProfileProps {
  user: User;
  listings: Listing[];
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, listings, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateUser({ ...user, avatar: base64String });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -translate-y-24 translate-x-24 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-full translate-y-16 -translate-x-16 blur-2xl opacity-40"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full scale-110"></div>
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white dark:border-slate-700 shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <img src={user.avatar} alt={user.name} className="w-40 h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                    <i className={`fas ${isUploading ? 'fa-circle-notch fa-spin' : 'fa-camera'} text-white text-2xl`}></i>
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Change Photo</span>
                </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-1">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{user.college}</span>
                <span className="text-slate-400 font-bold text-xs">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{user.year}</span>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-medium">
              Sharing expertise in {user.branch} and looking to trade for creative and technical skills.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {user.skills.length > 0 ? user.skills.map(skill => (
                <span key={skill} className="px-4 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm">
                  {skill}
                </span>
              )) : (
                <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                    <i className="fas fa-tag text-[10px]"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Skill Tags Yet</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-col gap-4 min-w-[160px]">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 text-center shadow-inner">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">Reputation</p>
               <p className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                 {user.reputation.toFixed(1)}<span className="text-amber-400 text-xl">★</span>
               </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 text-center shadow-inner">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">Trades</p>
               <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{user.tradesCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
              <i className="fas fa-layer-group mr-4 text-indigo-500"></i>
              Active Listings
            </h2>
            
            <div className="space-y-4">
              {listings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/30 border-2 border-dashed border-slate-100 dark:border-slate-800 p-20 text-center rounded-[2.5rem]">
                   <i className="fas fa-box-open text-4xl text-slate-200 dark:text-slate-800 mb-4"></i>
                   <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">Zero listings found</p>
                </div>
              ) : (
                listings.map(l => (
                  <div key={l.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl flex items-center justify-between hover:border-indigo-500 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${l.type === 'SKILL' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <i className={`fas ${l.type === 'SKILL' ? 'fa-bolt' : 'fa-file-alt'}`}></i>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition text-lg">{l.title}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{l.type} • {l.category}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
         </div>

         <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
              <i className="fas fa-award mr-4 text-amber-500"></i>
              Achievements
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm border border-amber-100 dark:border-amber-900/30">
                    <i className="fas fa-fire"></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">First Spark</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">New Member</p>
                  </div>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/30">
                    <i className="fas fa-id-badge"></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">Verified Pro</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Email Confirmed</p>
                  </div>
               </div>
               <div className="flex items-center space-x-4 opacity-30 grayscale">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-500">Master Trader</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Locked: 10 Trades</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
