import React, { useState, useEffect } from 'react';
import { Send, Loader2, ThumbsUp, X, Trash2 } from 'lucide-react';

const getRelativeTime = (dateString: string) => {
  if (!dateString) return "Hace un momento";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} d`;
};

export default function CommentSection({ postId, user, postContent }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/get_comments.php?post_id=${postId}&user_id=${user.id}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const renderTextWithMentions = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <span key={index} className="text-[#1877F2] font-bold hover:underline cursor-pointer" onClick={() => window.location.href=`/profile.php?id=${match[2]}`}>{match[1]}</span>
        );
      }
      return part;
    });
  };

  const handleLike = async (commentId: number) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = c.user_has_liked == 1;
        return {
          ...c,
          user_has_liked: isLiked ? 0 : 1,
          likes_count: isLiked ? Math.max(0, parseInt(c.likes_count) - 1) : parseInt(c.likes_count) + 1
        };
      }
      return c;
    }));
    const fd = new FormData();
    fd.append('comment_id', commentId.toString());
    fd.append('user_id', user.id);
    await fetch('/api/comments/like.php', { method: 'POST', body: fd });
  };

  const handleSend = async () => {
    if (!newComment.trim() || loading) return;
    setLoading(true);
    const finalContent = replyingTo ? `@[${replyingTo.name}](${replyingTo.id}) ${newComment}` : newComment;
    const res = await fetch('/api/comments/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, user_id: user.id, content: finalContent, parent_id: replyingTo?.id || null })
    });
    if ((await res.json()).success) {
      window.dispatchEvent(new CustomEvent('comment-added', { detail: { postId } }));
      setNewComment("");
      setReplyingTo(null);
      fetchComments();
    }
    setLoading(false);
  };

  const renderComment = (c: any, isReply = false) => (
    <div key={c.id} className={`${isReply ? 'ml-10 mt-2 border-l-2 border-gray-100 dark:border-[#3E4042] pl-3' : 'mt-4'}`}>
      <div className="flex gap-2 group">
        <img src={c.profile_photo || '/default-avatar.jpg'} className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full object-cover flex-shrink-0`} />
        
        <div className="flex flex-col flex-1 min-w-0 items-start">
          <div className="flex items-center gap-2 w-full">
            {/* BURBUJA DE TEXTO */}
            <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-[18px] px-3 py-2 shadow-sm max-w-fit min-w-[60px]">
              <p className="text-[13px] font-bold dark:text-white hover:underline cursor-pointer">{c.full_name}</p>
              <div className="text-[15px] dark:text-gray-200 leading-snug break-words">
                {renderTextWithMentions(c.content)}
              </div>
            </div>

            {/* CONTENEDOR DE ICONOS ACCIÓN (LIKE Y BORRAR) */}
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {/* ICONO ME GUSTA SIN BORDES NI FONDO */}
              {parseInt(c.likes_count) > 0 && (
                <div className="flex items-center gap-1 px-1 py-0.5">
                  <div className="bg-[#1877F2] rounded-full p-0.5 flex items-center justify-center">
                    <ThumbsUp size={10} className="text-white fill-white" />
                  </div>
                  <span className="text-[12px] font-bold text-[#65676B] dark:text-gray-300">
                    {c.likes_count}
                  </span>
                </div>
              )}

              {/* BOTÓN BORRAR (VISIBLE SIEMPRE PARA MÓVILES) */}
              {(user.id == c.user_id || user.role === 'admin') && (
                <button 
                  onClick={() => { setCommentToDelete(c.id); setShowDeletePopup(true); }} 
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-all rounded-full hover:bg-gray-100 dark:hover:bg-[#3A3B3C]"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ACCIONES DEBAJO (ME GUSTA / RESPONDER / TIEMPO) */}
          <div className="flex items-center gap-4 mt-1 ml-2 text-[12px] font-bold text-[#65676B] dark:text-[#B0B3B8]">
            <button onClick={() => handleLike(c.id)} className={`hover:underline ${c.user_has_liked == 1 ? 'text-[#1877F2]' : ''}`}>Me gusta</button>
            <button onClick={() => setReplyingTo({ id: c.id, name: c.full_name })} className="hover:underline">Responder</button>
            <span className="font-normal">{getRelativeTime(c.created_at)}</span>
          </div>
        </div>
      </div>
      {comments.filter(r => r.parent_id == c.id).map(r => renderComment(r, true))}
    </div>
  );

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-[#242526]">
      {showDeletePopup && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#242526] rounded-xl shadow-2xl max-w-[450px] w-full overflow-hidden border dark:border-[#3E4042]">
            <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
              <h3 className="text-xl font-bold dark:text-white w-full text-center">¿Eliminar Comentario?</h3>
              <button onClick={() => setShowDeletePopup(false)} className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 text-center text-[15px] text-[#65676B] dark:text-gray-300">¿Seguro que quieres eliminar este comentario?</div>
            <div className="p-4 flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowDeletePopup(false)} className="text-[#1877F2] font-bold px-4 hover:underline">Cancelar</button>
              <button onClick={async () => {
                await fetch(`/api/comments/delete.php?id=${commentToDelete}&user_id=${user.id}`, { method: 'DELETE' });
                setComments(prev => prev.filter(c => c.id !== commentToDelete));
                setShowDeletePopup(false);
              }} className="bg-[#1877F2] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#166FE5]">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="mb-4 text-[15px] dark:text-gray-200 italic border-b dark:border-[#3E4042] pb-2">
          {renderTextWithMentions(postContent)}
        </div>
        {comments.filter(c => !c.parent_id || c.parent_id == "0").map(c => renderComment(c))}
      </div>

      <div className="p-3 border-t dark:border-[#3E4042] bg-white dark:bg-[#242526]">
        {replyingTo && (
          <div className="flex items-center justify-between bg-[#E7F3FF] dark:bg-[#263951] px-3 py-1.5 mb-2 rounded-lg">
            <span className="text-[12px] text-[#1877F2]">Respondiendo a <b>{replyingTo.name}</b></span>
            <button onClick={() => setReplyingTo(null)} className="text-[#1877F2]"><X size={14}/></button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <img src={user.profile_photo || '/default-avatar.jpg'} className="w-9 h-9 rounded-full object-cover" />
          <div className="flex-1 relative flex items-center bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-full px-4 py-2">
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Escribe un comentario..." className="flex-1 bg-transparent dark:text-white outline-none text-[15px]" />
            <button onClick={handleSend} className={`ml-2 ${newComment.trim() ? 'text-[#1877F2]' : 'text-gray-400'}`}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}