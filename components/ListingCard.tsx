
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onTradeRequest: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onTradeRequest }) => {
  const isSkill = listing.type === 'SKILL';

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden hover:shadow-2xl dark:hover:shadow-indigo-900/10 transition-all duration-300 group flex flex-col h-full shadow-sm">
      <div className={`h-2.5 ${isSkill ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
      
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
            isSkill 
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30' 
              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
          }`}>
            {listing.type}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="font-black text-xl text-slate-950 dark:text-slate-100 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {listing.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
          {listing.description}
        </p>

        {isSkill && listing.level && (
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[11px] bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold border border-slate-200/50 dark:border-slate-600/50">
              <i className="fas fa-signal mr-1.5 text-indigo-500"></i> {listing.level}
            </span>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold border border-slate-200/50 dark:border-slate-600/50">
              <i className="fas fa-clock mr-1.5 text-indigo-500"></i> {listing.duration}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          {listing.tags.map(tag => (
            <span key={tag} className="text-[11px] font-bold text-indigo-600/60 dark:text-slate-500 hover:text-indigo-600 transition cursor-default">
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
             <img src={listing.userAvatar} alt={listing.userName} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-300">{listing.userName}</span>
        </div>
        <button 
          onClick={onTradeRequest}
          className="bg-slate-950 dark:bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
        >
          Propose
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
