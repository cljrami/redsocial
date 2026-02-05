import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export default function PostCard({ post, onOpenComments }: any) {
  const [user, setUser] = useState({ id: 1, name: "Administrador", profile_photo: "" });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    setUser(prev => ({ ...prev, ...session }));
  }, []);

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4 transition-colors font-sans">
      
      {/* 1. ENCABEZADO */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold overflow-hidden border dark:border-[#4E4F50]">
            {user.profile_photo ? <img src={user.profile_photo} className="w-full h-full object-cover" /> : "A"}
          </div>
          <div>
            <p className="font-bold dark:text-white text-[15px] leading-tight hover:underline cursor-pointer">
              {post.full_name || "Administrador"}
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-full text-gray-600 dark:text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 2. CONTENIDO */}
      <div className="px-4 pb-3 text-[15px] text-gray-800 dark:text-gray-200 leading-normal">
        {post.content}
      </div>

      {/* 3. IMAGEN / ARCHIVO (Click abre el popup) */}
      {post.image_url && (
        <div 
          className="bg-gray-100 dark:bg-[#3A3B3C] border-y dark:border-[#3E4042] cursor-pointer"
          onClick={onOpenComments}
        >
          <img src={post.image_url} className="w-full max-h-[500px] object-contain mx-auto" alt="Contenido" />
        </div>
      )}

      {/* 4. ESTADÍSTICAS */}
      <div className="px-4 py-2 flex justify-between items-center border-b dark:border-[#3E4042] text-gray-500 dark:text-gray-400 text-[14px]">
        <div className="flex items-center gap-1">
          <span className="bg-blue-500 p-1 rounded-full text-white flex items-center justify-center">
            <ThumbsUp size={10} fill="white" />
          </span>
          <span>{post.likes_total || 0}</span>
        </div>
        <div className="hover:underline cursor-pointer" onClick={onOpenComments}>
          {post.comments_total || 0} comentarios
        </div>
      </div>

      {/* 5. ACCIONES (El botón comentar abre el popup) */}
      <div className="flex px-1 py-1">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#3A3B3C] text-gray-600 dark:text-gray-300 font-bold text-sm transition-colors">
          <ThumbsUp size={20} className={post.user_has_liked ? "text-blue-600 fill-current" : ""} />
          <span>Me gusta</span>
        </button>
        
        <button 
          onClick={onOpenComments}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#3A3B3C] text-gray-600 dark:text-gray-300 font-bold text-sm transition-colors"
        >
          <MessageCircle size={20} />
          <span>Comentar</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#3A3B3C] text-gray-600 dark:text-gray-300 font-bold text-sm transition-colors">
          <Share2 size={20} />
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
}