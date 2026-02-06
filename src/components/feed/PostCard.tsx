import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Globe, Trash2, X } from 'lucide-react';

export default function PostCard({ post, onOpenComments }: any) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Recuperamos la sesión para validar si el post es nuestro
  const session = JSON.parse(localStorage.getItem("user_session") || "{}");
  const isOwner = session.id === post.user_id;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const postDate = new Date(dateStr);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d`;
    return postDate.toLocaleDateString();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/posts/delete.php', {
        method: 'POST',
        body: new URLSearchParams({ 'post_id': post.id, 'user_id': session.id })
      });
      const data = await res.json();
      if (data.success) {
        const element = document.getElementById(`post-${post.id}`);
        if (element) {
          element.style.opacity = '0';
          element.style.transform = 'scale(0.95)';
          setTimeout(() => element.remove(), 300);
        }
      }
    } catch (e) { console.error("Error al borrar:", e); }
    setShowDeleteModal(false);
  };

  const isUpdatePhoto = post.content.includes("actualizó su foto") || post.content.includes("ha actualizado su foto");

  return (
    <div id={`post-${post.id}`} className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4 font-sans transition-all duration-300">
      
      {/* HEADER: Nombre y acción en la misma línea */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border dark:border-[#4E4F50]">
            {post.profile_photo ? <img src={post.profile_photo} className="w-full h-full object-cover" /> : (post.full_name?.[0] || 'U')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-1.5 leading-tight">
              <span className="font-bold dark:text-white text-[15px] hover:underline cursor-pointer">{post.full_name || "Usuario"}</span>
              {isUpdatePhoto && <span className="text-gray-500 dark:text-gray-400 text-[15px] font-normal">{post.content}</span>}
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>·</span>
              <Globe size={12} />
            </div>
          </div>
        </div>
        
        {/* MENÚ DE OPCIONES (TRES PUNTOS) */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowOptions(!showOptions)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <MoreHorizontal size={20} />
          </button>

          {showOptions && isOwner && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#242526] shadow-xl rounded-lg border dark:border-[#3E4042] py-2 z-50 animate-in zoom-in-95 duration-100">
              <button 
                onClick={() => { setShowDeleteModal(true); setShowOptions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] font-semibold text-sm transition-colors"
              >
                <Trash2 size={18} /> Eliminar publicación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CUERPO DEL POST */}
      {!isUpdatePhoto && (
        <div className="px-4 pb-3 text-[15px] dark:text-gray-200 leading-normal">
          {post.content}
        </div>
      )}

      {/* IMAGEN DEL POST */}
      {post.image_url && (
        <div className="bg-gray-100 dark:bg-black/10 border-t dark:border-[#3E4042]">
          <img src={post.image_url} className="w-full h-auto max-h-[600px] object-contain cursor-pointer" onClick={onOpenComments} />
        </div>
      )}

      {/* INTERACCIONES (RECUPERADAS) */}
      <div className="px-4 py-2 flex justify-between text-[13px] text-gray-500 border-b dark:border-[#3E4042]">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 p-1 rounded-full text-white"><ThumbsUp size={10} fill="white" /></div>
          <span>{post.likes_total || 0}</span>
        </div>
        <div className="hover:underline cursor-pointer" onClick={onOpenComments}>{post.comments_total || 0} comentarios</div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex p-1">
        <button className="flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 font-bold text-sm text-gray-600 dark:text-gray-400">
          <ThumbsUp size={18} /> Me gusta
        </button>
        <button onClick={onOpenComments} className="flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-bold text-sm">
          <MessageCircle size={18} /> Comentar
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN (ESTILO FACEBOOK EXACTO) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#242526] w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
              <h3 className="text-xl font-bold dark:text-white w-full text-center">¿Eliminar Publicación?</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] hover:bg-gray-200 dark:hover:bg-[#4E4F50] rounded-full text-gray-600 dark:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-[15px] text-gray-600 dark:text-gray-300">
              ¿Confirmas que quieres eliminar esta publicación?
            </div>

            <div className="p-4 flex justify-end items-center gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-blue-600 font-bold hover:underline px-2"
              >
                No
              </button>
              <button 
                onClick={handleDelete}
                className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}