import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Laugh } from 'lucide-react';

// CAMBIO 1: Agregamos userPhoto opcional para sincronizar con el FeedManager
interface PostInputProps {
  onClick: () => void;
  userName: string;
  userPhoto?: string; 
}

export default function PostInputTrigger({ onClick, userName, userPhoto }: PostInputProps) {
  const [user, setUser] = useState({ name: userName, profile_photo: userPhoto || '' });

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
    window.addEventListener('user_session_updated', syncUser);
    return () => window.removeEventListener('user_session_updated', syncUser);
  }, [userName, userPhoto]); // CAMBIO 2: Dependencias añadidas

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] p-4 mb-5 transition-all">
      <div className="flex items-center gap-3 mb-3">
        {/* CAMBIO 3: Estilización del Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden border dark:border-[#4E4F50]">
          {user.profile_photo ? (
            <img src={user.profile_photo} className="w-full h-full object-cover" alt="Perfil" />
          ) : (
            <span>{user.name[0]?.toUpperCase()}</span>
          )}
        </div>
        <button 
          onClick={onClick}
          className="flex-1 bg-gray-100 dark:bg-[#3A3B3C] hover:bg-gray-200 dark:hover:bg-[#4E4F50] rounded-full px-4 py-2.5 text-left text-gray-500 dark:text-gray-400 text-[15px] transition-colors"
        >
          {/* CAMBIO 4: Nombre dinámico */}
          ¿Qué estás pensando, {user.name.split(' ')[0]}?
        </button>
      </div>

      {/* CAMBIO 5: Ajuste de colores en modo oscuro */}
      <div className="flex gap-1 border-t dark:border-[#3E4042] pt-2">
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-[#3A3B3C] rounded-lg text-[#F3425F] font-semibold text-[13px] md:text-sm transition-colors">
          <Video size={20}/> <span className="hidden sm:inline">Video en vivo</span>
        </button>
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-[#3A3B3C] rounded-lg text-[#45BD62] font-semibold text-[13px] md:text-sm transition-colors">
          <ImageIcon size={20}/> <span className="hidden sm:inline">Foto/video</span>
        </button>
        <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-[#3A3B3C] rounded-lg text-[#F7B928] font-semibold text-[13px] md:text-sm transition-colors">
          <Laugh size={20}/> <span className="hidden sm:inline">Sentimiento</span>
        </button>
      </div>
    </div>
  );
}