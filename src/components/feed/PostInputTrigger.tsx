import React from 'react';
import { Video, Image as ImageIcon, Laugh } from 'lucide-react';

export default function PostInputTrigger({ onClick, userName }: { onClick: () => void, userName: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
          {userName[0]}
        </div>
        <button 
          onClick={onClick}
          className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-left text-gray-500 text-[15px]"
        >
          ¿Qué estás pensando, {userName}?
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