
import React, { useState } from 'react';
import { User, Listing, ListingType } from '../types';

interface AddListingModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (listing: Listing) => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ user, onClose, onSubmit }) => {
  const [type, setType] = useState<ListingType>('SKILL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) return;

    const newListing: Listing = {
      id: `l${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type,
      title,
      description,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      level: type === 'SKILL' ? 'Intermediate' : undefined,
      duration: type === 'SKILL' ? '1 Hour' : undefined,
    };

    onSubmit(newListing);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Post New Offer</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Offer Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setType('SKILL')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'SKILL' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-500'}`}
                >
                  <i className="fas fa-bolt mr-2"></i> Skill Session
                </button>
                <button 
                  type="button"
                  onClick={() => setType('MATERIAL')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'MATERIAL' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-500'}`}
                >
                  <i className="fas fa-file-alt mr-2"></i> Study Material
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Title</label>
              <input 
                required
                type="text" 
                placeholder={type === 'SKILL' ? "e.g. Intro to React" : "e.g. Physics 101 Notes"}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Engineering, Arts, Business"
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Briefly explain what you're offering..."
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="react, coding, tutorial"
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Post Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;
