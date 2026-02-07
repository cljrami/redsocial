import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Globe, Trash2, X } from 'lucide-react';

export default function PostCard({ post, onOpenComments }: any) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados de interacción recuperados
  const [isLiked, setIsLiked] = useState(post.user_has_liked == 1);
  const [likesCount, setLikesCount] = useState(parseInt(post.likes_total) || 0);
  const [commentsCount, setCommentsCount] = useState(parseInt(post.comments_total) || 0);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const session = JSON.parse(localStorage.getItem("user_session") || "{}");
  const isOwner = session.id === post.user_id;

  // ESCUCHA DE COMENTARIOS: Para que el número suba cuando comentas
  useEffect(() => {
    const handleCommentAdded = (e: any) => {
      if (e.detail.postId === post.id) {
        setCommentsCount(prev => prev + 1);
      }
    };
    window.addEventListener('comment-added', handleCommentAdded);
    return () => window.removeEventListener('comment-added', handleCommentAdded);
  }, [post.id]);

  // Sincronización inicial
  useEffect(() => {
    setIsLiked(post.user_has_liked == 1);
    setLikesCount(parseInt(post.likes_total) || 0);
    setCommentsCount(parseInt(post.comments_total) || 0);
  }, [post.id, post.user_has_liked, post.likes_total, post.comments_total]);

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return "Hace un momento";
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    return postDate.toLocaleDateString();
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

  const type = (post.post_type || "").trim().toLowerCase();
  const isSystemUpdate = type === 'profile_photo' || type === 'cover_photo' || type === 'story_share';

  return (
    <div id={`post-${post.id}`} className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4 font-sans">
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex gap-3 w-full min-w-0">
          <img src={post.profile_photo || '/default-avatar.jpg'} className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer" />
          
          <div className="flex flex-col min-w-0 flex-1">
            {/* CABECERA: Nombre y acción en la misma fila */}
            <div className="text-[15px] leading-snug">
              <span className="font-bold dark:text-white hover:underline cursor-pointer">
                {post.full_name}
              </span>
              <span className="text-[#65676B] dark:text-[#B0B3B8] font-normal ml-1">
                {type === 'story_share' && "ha publicado una historia."}
                {type === 'profile_photo' && "actualizó su foto de perfil."}
                {type === 'cover_photo' && "actualizó su foto de portada."}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-[12px] text-[#65676B] dark:text-[#B0B3B8] font-normal mt-0.5">
              <span>{getRelativeTime(post.created_at)}</span> · <Globe size={12} />
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowOptions(!showOptions)} className="p-2 hover:bg-black/5 dark:hover:bg-[#3A3B3C] rounded-full text-gray-500">
            <MoreHorizontal size={20} />
          </button>
          {showOptions && isOwner && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#242526] shadow-xl rounded-lg border dark:border-[#3E4042] py-2 z-50">
              <button onClick={() => { setShowDeleteModal(true); setShowOptions(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-[#3A3B3C]">
                <Trash2 size={18} /> Eliminar publicación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bloqueamos el contenido inferior en actualizaciones automáticas */}
      {post.content && !isSystemUpdate && (
        <div className="px-4 pb-3 text-[15px] dark:text-gray-200 leading-normal">
          {post.content}
        </div>
      )}

      {post.image_url && (
        <div className="border-t border-b dark:border-[#3E4042] bg-gray-50 dark:bg-black/20">
          <img src={post.image_url} className="w-full h-auto max-h-[600px] object-contain mx-auto cursor-pointer" onClick={onOpenComments} />
        </div>
      )}

      {/* CONTADORES: Likes y Comentarios */}
      <div className="px-4 py-2 flex justify-between text-[13px] text-gray-500 border-b dark:border-[#3E4042]">
        <div className="flex items-center gap-1">
          <div className="bg-[#1877F2] p-1 rounded-full text-white">
            <ThumbsUp size={10} fill="white" />
          </div>
          <span className="font-medium">{likesCount}</span>
        </div>
        <div className="hover:underline cursor-pointer font-medium" onClick={onOpenComments}>
          {commentsCount} comentarios
        </div>
      </div>

      {/* BOTONES: Me gusta y Comentar */}
      <div className="flex p-1">
        <button onClick={handleLike} className={`flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-[#3A3B3C] flex items-center justify-center gap-2 font-bold text-sm transition-colors ${isLiked ? 'text-[#1877F2]' : 'text-gray-600 dark:text-gray-400'}`}>
          <ThumbsUp size={18} className={isLiked ? 'fill-[#1877F2]' : ''} /> Me gusta
        </button>
        <button onClick={onOpenComments} className="flex-1 py-2 rounded-md hover:bg-black/5 dark:hover:bg-[#3A3B3C] flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-bold text-sm">
          <MessageCircle size={18} /> Comentar
        </button>
      </div>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden border dark:border-[#3E4042]">
            <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
              <h3 className="text-xl font-bold dark:text-white w-full text-center">¿Eliminar publicación?</h3>
              <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white hover:bg-gray-200"><X size={20} /></button>
            </div>
            <div className="p-6 text-[15px] text-gray-600 dark:text-gray-300">¿Estás seguro de que quieres eliminar esta publicación?</div>
            <div className="p-4 flex justify-end gap-4 px-6 pb-6">
              <button onClick={() => setShowDeleteModal(false)} className="text-[#1877F2] font-bold px-2 hover:underline">Cancelar</button>
              <button onClick={async () => {
                const fd = new FormData();
                fd.append('post_id', post.id);
                fd.append('user_id', session.id);
                await fetch('/api/posts/delete_post.php', { method: 'POST', body: fd });
                window.dispatchEvent(new Event('user_session_updated'));
                setShowDeleteModal(false);
              }} className="bg-[#1877F2] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#166FE5]">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}