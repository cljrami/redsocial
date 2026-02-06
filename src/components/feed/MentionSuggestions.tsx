import React from 'react';

export default function MentionSuggestions({ users, onSelect, position }: any) {
  if (!users || users.length === 0) return null;

  return (
    <div 
      className="fixed z-[9999] bg-white dark:bg-[#242526] shadow-2xl rounded-xl border dark:border-[#3E4042] w-64 overflow-hidden animate-in zoom-in-95 duration-100"
      style={{ 
        top: position.top, 
        left: position.left 
      }}
    >
      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b dark:border-[#3E4042]">
        Mencionar vecino
      </div>
      <div className="max-h-48 overflow-y-auto">
        {users.map((u: any) => (
          <button 
            key={u.id} 
            onClick={() => onSelect(u)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-[#3A3B3C] text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold overflow-hidden">
              {u.profile_photo ? (
                <img src={u.profile_photo} className="w-full h-full object-cover" alt="" />
              ) : (u.full_name?.[0] || '?')}
            </div>
            <span className="text-sm font-bold dark:text-white group-hover:text-[#1877F2]">
              {u.full_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}