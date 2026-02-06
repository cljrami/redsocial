import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Laugh } from 'lucide-react';

export default function PostInputTrigger({ onClick, userName }: { onClick: () => void, userName: string }) {
  const [user, setUser] = useState({ name: userName, profile_photo: '' });

  useEffect(() => {
    const syncUser = () => {
      const session = JSON.parse(localStorage.getItem("user_session") || "{}");
      if (session.name) {
        setUser({
          name: session.name,
          profile_photo: session.profile_photo || ''
        });
      }
    };

    syncUser();
    // Escuchar cambios de foto de perfil [cite: 2026-02-04]
    window.addEventListener('user_session_updated', syncUser);
    return () => window.removeEventListener('user_session_updated', syncUser);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5 transition-all">
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar con foto de perfil real [cite: 2026-02-04] */}
        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden border">
          {user.profile_photo ? (
            <img src={user.profile_photo} className="w-full h-full object-cover" />
          ) : (
            <span>{user.name[0]}</span>
          )}
        </div>
        <button 
          onClick={onClick}
          className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-left text-gray-500 text-[15px] transition-colors"
        >
          ¿Qué estás pensando, {user.name}?
        </button>
      </div>
      <div className="flex gap-1 border-t pt-2">
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-red-500 font-semibold text-sm transition-colors">
          <Video size={20}/> Video en vivo
        </button>
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-green-500 font-semibold text-sm transition-colors">
          <ImageIcon size={20}/> Foto/video
        </button>
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-yellow-500 font-semibold text-sm transition-colors">
          <Laugh size={20}/> Sentimiento/actividad
        </button>
      </div>
    </div>
  );
}