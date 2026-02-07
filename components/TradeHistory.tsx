
import React from 'react';
import { Trade, Listing, TradeStatus } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
  listings: Listing[];
  currentUserId: string;
  onUpdateStatus: (id: string, status: TradeStatus) => void;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, listings, currentUserId, onUpdateStatus }) => {
  
  const getListingById = (id: string) => listings.find(l => l.id === id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trade Requests</h1>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {trades.length} Active Swaps
        </div>
      </div>

      <div className="space-y-4">
        {trades.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-dashed dark:border-slate-700 rounded-3xl p-20 text-center text-slate-400 dark:text-slate-600">
            <i className="fas fa-handshake-slash text-5xl mb-4 opacity-30"></i>
            <p className="font-medium">No trade history yet.</p>
            <p className="text-sm">Initiate a swap from the explore feed to see it here.</p>
          </div>
        ) : (
          trades.map(trade => {
            const isRequester = trade.requesterId === currentUserId;
            const itemWanted = getListingById(isRequester ? trade.providerItemId : trade.requesterItemId);
            const itemOffered = getListingById(isRequester ? trade.requesterItemId : trade.providerItemId);
            
            return (
              <div key={trade.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                         trade.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                         trade.status === 'ACCEPTED' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                         trade.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                         'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                       }`}>
                         {trade.status}
                       </span>
                       <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(trade.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">You Give</p>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{itemOffered?.title}</h4>
                      </div>
                      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-full w-10 h-10 border border-slate-100 dark:border-slate-700">
                         <i className="fas fa-exchange-alt text-slate-300 dark:text-slate-600"></i>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">You Get</p>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{itemWanted?.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6 space-y-2 min-w-[150px]">
                    {trade.status === 'PENDING' && !isRequester && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(trade.id, 'ACCEPTED')}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
                        >
                          Approve Trade
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(trade.id, 'REJECTED')}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {trade.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => onUpdateStatus(trade.id, 'COMPLETED')}
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition"
                      >
                        Confirm Completion
                      </button>
                    )}
                    {(trade.status === 'PENDING' && isRequester) && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 italic text-center">Awaiting response...</p>
                    )}
                    {trade.status === 'COMPLETED' && (
                      <div className="text-center">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">Trade Successful!</p>
                        <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Write a Review</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
