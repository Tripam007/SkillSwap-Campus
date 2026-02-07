
import React, { useState, useMemo } from 'react';
import { Listing } from '../types';
import ListingCard from './ListingCard';
import TradeModal from './TradeModal';

interface FeedProps {
  listings: Listing[];
  userItems: Listing[];
  onCreateTrade: (pId: string, pItemId: string, rItemId: string) => void;
  onOpenAddListing: () => void;
}

const Feed: React.FC<FeedProps> = ({ listings, userItems, onCreateTrade, onOpenAddListing }) => {
  const [filter, setFilter] = useState<'ALL' | 'SKILL' | 'MATERIAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchesType = filter === 'ALL' || l.type === filter;
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [listings, filter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Header with explicit light mode color to prevent merging */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Discover Opportunities
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search skills, notes..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm">
            {(['ALL', 'SKILL', 'MATERIAL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  filter === t 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase() + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onTradeRequest={() => setSelectedListing(listing)} 
            />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white/50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-slate-300 dark:text-slate-700 mb-6">
              <i className="fas fa-search text-8xl"></i>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">No results matching your criteria</p>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search or filter.</p>
          </div>
        )}
      </div>

      {selectedListing && (
        <TradeModal 
          listing={selectedListing} 
          userItems={userItems}
          onClose={() => setSelectedListing(null)}
          onSubmit={(rItemId) => {
            onCreateTrade(selectedListing.userId, selectedListing.id, rItemId);
            setSelectedListing(null);
          }}
          onOpenAddListing={() => {
            setSelectedListing(null);
            onOpenAddListing();
          }}
        />
      )}
    </div>
  );
};

export default Feed;
