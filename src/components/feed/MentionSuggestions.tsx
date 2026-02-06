import React from 'react';

export default function MentionSuggestions({ users, onSelect, position }: any) {
  if (users.length === 0) return null;

  return (
    <div 
      className="fixed z-[10001] bg-white dark:bg-[#242526] shadow-2xl rounded-lg border dark:border-[#3E4042] overflow-hidden w-64 animate-in fade-in zoom-in duration-100"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-2 text-xs font-bold text-gray-500 border-b dark:border-[#3E4042] dark:text-gray-400">
        SUGERENCIAS
      </div>
      <ul className="max-h-48 overflow-y-auto no-scrollbar">
        {users.map((u: any) => (
          <li 
            key={u.id} 
            onClick={() => onSelect(u)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] cursor-pointer transition-colors"
          >
            <img src={u.profile_photo || '/default-avatar.jpg'} className="w-8 h-8 rounded-full object-cover" alt="" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold dark:text-white">{u.full_name}</span>
              <span className="text-[10px] text-gray-500 uppercase">{u.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}