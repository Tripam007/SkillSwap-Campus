
import React, { useState, useEffect } from 'react';
import { User, Listing, Trade } from './types';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import TradeHistory from './components/TradeHistory';
import Login from './components/Login';
import AddListingModal from './components/AddListingModal';
import AIStudio from './components/AIStudio';
import LiveAssistant from './components/LiveAssistant';

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    userId: 'u1',
    userName: 'Sarah Lee',
    userAvatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah&hair=long06&accessory=glasses',
    type: 'MATERIAL',
    title: 'Operating Systems - Unit 3 Notes',
    description: 'Detailed handwritten notes on CPU scheduling, Memory Management, and Deadlocks. Perfect for exam prep.',
    category: 'Computer Science',
    tags: ['os', 'exam prep', 'mit'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    userId: 'u2',
    userName: 'David Chen',
    userAvatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=David&hair=short01&eyebrows=variant03',
    type: 'SKILL',
    title: 'Python for Data Science Tutoring',
    description: 'One-on-one session covering Pandas, NumPy and Matplotlib. I can help with your semester projects.',
    category: 'Programming',
    level: 'Intermediate',
    duration: '1 Hour',
    tags: ['python', 'data science', 'tutoring'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l3',
    userId: 'u3',
    userName: 'Elena Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Elena&hair=long01&mouth=happy02',
    type: 'MATERIAL',
    title: 'Organic Chemistry Model Kit',
    description: 'Hardly used model kit for 3D molecular structures. Looking to swap for Calculus 2 help.',
    category: 'Chemistry',
    tags: ['chemistry', 'stem', 'models'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l4',
    userId: 'u4',
    userName: 'Marcus Aurelius',
    userAvatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Marcus&hair=short05&beard=variant02',
    type: 'SKILL',
    title: 'Philosophy & Critical Thinking',
    description: 'Deep dive into Stoicism and logic. Great for improving your analytical essay writing skills.',
    category: 'Humanities',
    level: 'Advanced',
    duration: '45 Mins',
    tags: ['philosophy', 'essays', 'logic'],
    createdAt: new Date().toISOString(),
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'FEED' | 'PROFILE' | 'TRADES' | 'STUDIO'>('FEED');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedUser = localStorage.getItem('skillswap_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    
    const savedTheme = localStorage.getItem('skillswap_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    
    // Near-instant splash screen for ultra-responsive feel
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('skillswap_theme', newTheme);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn("Storage quota hit. Profile updates will not persist on refresh.");
    }
    
    setListings(prev => prev.map(l => 
      l.userId === updatedUser.id 
        ? { ...l, userName: updatedUser.name, userAvatar: updatedUser.avatar } 
        : l
    ));
  };

  const checkAndOpenKeySelector = async () => {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-indigo-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white text-5xl shadow-2xl shadow-indigo-500/50">
              <i className="fas fa-repeat"></i>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-indigo-500/10 rounded-full animate-[spin_3s_linear_infinite]"></div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight">SkillSwap <span className="text-indigo-600">Campus</span></h1>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <div className={theme === 'dark' ? 'dark' : ''}><Login onLogin={setUser} /></div>;

  return (
    <div className={`${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen flex flex-col transition-colors duration-300`}>
      <Navbar 
        user={user} 
        activeView={view} 
        setView={(v) => { 
          if(v === 'STUDIO') checkAndOpenKeySelector();
          setView(v); 
        }} 
        onAddClick={() => setIsAddModalOpen(true)} 
        onLogout={() => {
            setUser(null);
            localStorage.removeItem('skillswap_user');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-300">
        {view === 'FEED' && (
          <Feed 
            listings={listings} 
            userItems={listings.filter(l => l.userId === user.id)} 
            onCreateTrade={(pId, pItemId, rItemId) => {
              const newTrade: Trade = {
                id: `t-${Date.now()}`,
                requesterId: user.id,
                providerId: pId,
                requesterItemId: rItemId,
                providerItemId: pItemId,
                status: 'PENDING',
                createdAt: new Date().toISOString()
              };
              setTrades([newTrade, ...trades]);
              setView('TRADES');
            }} 
            onOpenAddListing={() => setIsAddModalOpen(true)}
          />
        )}
        {view === 'PROFILE' && <Profile user={user} listings={listings.filter(l => l.userId === user.id)} onUpdateUser={handleUpdateUser} />}
        {view === 'TRADES' && (
          <TradeHistory 
            trades={trades} 
            listings={listings} 
            currentUserId={user.id} 
            onUpdateStatus={(id, status) => {
              setTrades(trades.map(t => t.id === id ? { ...t, status } : t));
            }} 
          />
        )}
        {view === 'STUDIO' && <AIStudio />}
      </main>

      <LiveAssistant />

      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 py-6 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
        &copy; 2026 SkillSwap Campus • Powered by Gemini Ultra Intelligence
      </footer>

      {isAddModalOpen && (
        <AddListingModal 
          user={user} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={(l) => {
            setListings([l, ...listings]);
            setIsAddModalOpen(false);
          }} 
        />
      )}
    </div>
  );
};

export default App;
