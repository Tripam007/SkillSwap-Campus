
import React, { useState } from 'react';
import { Listing } from '../types';

interface TradeModalProps {
  listing: Listing;
  userItems: Listing[];
  onClose: () => void;
  onSubmit: (requesterItemId: string) => void;
  onOpenAddListing: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ listing, userItems, onClose, onSubmit, onOpenAddListing }) => {
  const [selectedItemId, setSelectedItemId] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Propose a Swap</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Barter-based exchange only</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">You Want</label>
            <div className="flex items-center p-4 border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{listing.title}</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Offered by {listing.userName}</p>
              </div>
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400">
                <i className={`fas ${listing.type === 'SKILL' ? 'fa-bolt' : 'fa-file-alt'}`}></i>
              </div>
            </div>
          </div>

          <div className="text-center mb-6 relative">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
             </div>
             <div className="relative inline-block px-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600">
               <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full border border-slate-200 dark:border-slate-600">
                 <i className="fas fa-arrows-up-down text-slate-500 dark:text-slate-300"></i>
               </div>
             </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">You Offer in Return</label>
            {userItems.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {userItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`flex items-center p-3 border-2 rounded-2xl cursor-pointer transition ${
                      selectedItemId === item.id 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-inner' 
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm ${selectedItemId === item.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{item.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-tighter">{item.type}</p>
                    </div>
                    {selectedItemId === item.id && (
                      <i className="fas fa-check-circle text-indigo-600 dark:text-indigo-400"></i>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">You haven't posted any skills or materials yet.</p>
                 <button 
                  onClick={onOpenAddListing}
                  className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline hover:text-indigo-700 transition-colors"
                 >
                   Create a Listing First
                 </button>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button 
              disabled={!selectedItemId}
              onClick={() => onSubmit(selectedItemId)}
              className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
