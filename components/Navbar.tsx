
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  activeView: string;
  setView: (view: any) => void;
  onAddClick: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, activeView, setView, onAddClick, onLogout, theme, toggleTheme }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('FEED')}>
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <i className="fas fa-repeat"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            SkillSwap <span className="text-indigo-600">Campus</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setView('FEED')}
            className={`text-sm font-black uppercase tracking-widest transition-all duration-200 ${
              activeView === 'FEED' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explore
          </button>
          <button 
            onClick={() => setView('STUDIO')}
            className={`text-sm font-black uppercase tracking-widest transition-all duration-200 ${
              activeView === 'STUDIO' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fas fa-sparkles mr-2 opacity-50"></i> Studio
          </button>
          <button 
            onClick={() => setView('TRADES')}
            className={`text-sm font-black uppercase tracking-widest transition-all duration-200 ${
              activeView === 'TRADES' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Trades
          </button>
        </div>

        <div className="flex items-center space-x-5">
          <button onClick={toggleTheme} className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
            <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
          </button>

          <button onClick={onAddClick} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl active:scale-95 text-xs">
            <i className="fas fa-plus mr-2"></i> Post Offer
          </button>
          
          <div className="relative">
            <img 
              onClick={() => setShowMenu(!showMenu)}
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition" 
            />
            {showMenu && (
              <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl py-3 animate-in fade-in zoom-in duration-200">
                <button onClick={() => { setView('PROFILE'); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center"><i className="fas fa-user-circle mr-3 text-indigo-500"></i> Profile</button>
                <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center"><i className="fas fa-power-off mr-3"></i> Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
