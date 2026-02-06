import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Globe, Trash2, X } from 'lucide-react';

export default function PostCard({ post, onOpenComments }: any) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [isLiked, setIsLiked] = useState(post.user_has_liked == 1);
  const [likesCount, setLikesCount] = useState(parseInt(post.likes_total) || 0);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const session = JSON.parse(localStorage.getItem("user_session") || "{}");
  const isOwner = session.id === post.user_id;

  useEffect(() => {
    setIsLiked(post.user_has_liked == 1);
    setLikesCount(parseInt(post.likes_total) || 0);
  }, [post.id, post.user_has_liked, post.likes_total]);

  // --- LÓGICA DE MENCIONES (Mantenida intacta) ---
  const renderContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        const name = match[1];
        return (
          <span key={index} className="text-[#1877F2] font-bold hover:underline cursor-pointer">
            {name}
          </span>
        );
      }
      return part;
    });
  };

  const handleLike = async () => {
    if (!session.id) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));

    const fd = new FormData();
    fd.append('post_id', post.id);
    fd.append('user_id', session.id);
    
    try {
      const res = await fetch('/api/posts/like_post.php', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) { 
        setIsLiked(!nextState);
        setLikesCount(parseInt(post.likes_total));
      }
    } catch (e) {
      setIsLiked(!nextState);
    }
  };

  return (
    <div id={`post-${post.id}`} className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4">
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex gap-3 w-full">
          <img src={post.profile_photo || '/default-avatar.jpg'} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="Perfil" />
          
          <div className="flex-1 min-w-0">
            {/* CABECERA UNIFICADA: Nombre y Acción en la misma línea */}
            <div className="flex items-center gap-x-1.5 flex-wrap leading-tight">
              <span className="font-bold dark:text-white text-[15px] hover:underline cursor-pointer">
                {post.full_name}
              </span>
              
              {/* Acciones dinámicas al lado del nombre */}
              {post.post_type === 'story_share' && (
                <span className="text-gray-500 dark:text-gray-400 text-[14px]">
                  ha publicado una historia.
                </span>
              )}
              {post.post_type === 'profile_photo' && (
                <span className="text-gray-500 dark:text-gray-400 text-[14px]">
                  actualizó su foto de perfil.
                </span>
              )}
              {post.post_type === 'cover_photo' && (
                <span className="text-gray-500 dark:text-gray-400 text-[14px]">
                  actualizó su foto de portada.
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[12px] text-gray-500 font-medium mt-0.5">
              <span>Hace un momento</span> · <Globe size={12} />
            </div>
          </div>
        </div>
        
        {/* Menú de Opciones */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowOptions(!showOptions)} className="p-2 hover:bg-black/5 rounded-full text-gray-500"><MoreHorizontal size={20} /></button>
          {showOptions && isOwner && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#242526] shadow-xl rounded-lg border dark:border-[#3E4042] py-2 z-50">
              <button onClick={() => { setShowDeleteModal(true); setShowOptions(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-[#3A3B3C] transition-colors">
                <Trash2 size={18} /> Eliminar publicación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENIDO: Solo mostramos texto si no es una actualización de imagen (o si tiene contenido extra) */}
      <div className="px-4 pb-3 text-[15px] dark:text-gray-200 leading-normal">
        {post.post_type === 'text' || (post.post_type === 'story_share' && post.content) ? 
          renderContent(post.content) : null
        }
      </div>

      {post.image_url && (
        <div className="border-t border-b dark:border-[#3E4042] bg-gray-50 dark:bg-black/20">
          <img src={post.image_url} className="w-full h-auto max-h-[600px] object-contain mx-auto cursor-pointer" onClick={onOpenComments} />
        </div>
      )}

      {/* INTERACCIONES */}
      <div className="px-4 py-2 flex justify-between text-[13px] text-gray-500 border-b dark:border-[#3E4042]">
        <div className="flex items-center gap-1">
          <div className="bg-[#1877F2] p-1 rounded-full text-white">
            <ThumbsUp size={10} fill="white" />
          </div>
          <span className="font-medium">{likesCount}</span>
        </div>
        <div className="hover:underline cursor-pointer font-medium" onClick={onOpenComments}>{post.comments_total || 0} comentarios</div>
      </div>

      <div className="flex p-1">
        <button onClick={handleLike} className={`flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-[#3A3B3C] flex items-center justify-center gap-2 font-bold text-sm transition-colors ${isLiked ? 'text-[#1877F2]' : 'text-gray-600 dark:text-gray-400'}`}>
          <ThumbsUp size={18} className={isLiked ? 'fill-[#1877F2]' : ''} /> Me gusta
        </button>
        <button onClick={onOpenComments} className="flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-[#3A3B3C] flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-bold text-sm">
          <MessageCircle size={18} /> Comentar
        </button>
      </div>

      {/* MODAL BORRAR */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden border dark:border-[#3E4042]">
            <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
              <h3 className="text-xl font-bold dark:text-white w-full text-center">¿Eliminar Publicación?</h3>
              <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 text-[15px] text-gray-600 dark:text-gray-300">¿Estás seguro de que quieres eliminar esta publicación?</div>
            <div className="p-4 flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="text-[#1877F2] font-bold px-2">Cancelar</button>
              <button onClick={async () => {
                const fd = new FormData();
                fd.append('post_id', post.id);
                fd.append('user_id', session.id);
                await fetch('/api/posts/delete_post.php', { method: 'POST', body: fd });
                window.dispatchEvent(new Event('user_session_updated'));
                setShowDeleteModal(false);
              }} className="bg-[#1877F2] text-white px-8 py-2 rounded-lg font-bold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}