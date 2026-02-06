import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreHorizontal, Trash2, X, Globe } from 'lucide-react';

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{show: boolean, id: number | null}>({ show: false, id: null });
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  const session = JSON.parse(localStorage.getItem("user_session") || "{}");
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/get.php?post_id=${postId}`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (e) { console.error("Error al cargar comentarios:", e); }
  };

  useEffect(() => {
    fetchComments();
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [postId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSending || !session.id) return;

    setIsSending(true);

    try {
      // Sincronización: Enviamos JSON para que el PHP lo lea correctamente [cite: 2026-02-06]
      const res = await fetch('/api/comments/save.php', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: session.id,
          content: newComment.trim()
        }) 
      });
      
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        await fetchComments(); // Recarga la lista inmediatamente
        window.dispatchEvent(new Event('user_session_updated'));
      } else {
        console.error("Error del servidor:", data.message);
      }
    } catch (e) { 
      console.error("Error de red:", e); 
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!showDeleteModal.id) return;
    try {
      const res = await fetch('/api/comments/delete.php', {
        method: 'POST',
        body: new URLSearchParams({ 
          'comment_id': showDeleteModal.id.toString(), 
          'user_id': session.id 
        })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== showDeleteModal.id));
        window.dispatchEvent(new Event('user_session_updated'));
      }
    } catch (e) { console.error(e); }
    setShowDeleteModal({ show: false, id: null });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#242526]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} id={`comment-${comment.id}`} className="flex gap-2 group items-start">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 border dark:border-[#3E4042]">
              <img src={comment.profile_photo || '/default-avatar.jpg'} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col max-w-[85%] relative">
              <div className="bg-gray-100 dark:bg-[#3A3B3C] px-3 py-2 rounded-2xl">
                <p className="text-[13px] font-bold dark:text-white leading-tight mb-0.5">{comment.full_name}</p>
                <p className="text-[14px] dark:text-gray-200 leading-snug">{comment.content}</p>
              </div>
              <div className="flex gap-3 px-2 mt-1 text-[12px] font-bold text-gray-500 dark:text-gray-400">
                <button className="hover:underline">Me gusta</button>
                <span>Hace un momento</span>
              </div>
            </div>

            {session.id === comment.user_id && (
              <div className="relative self-center" ref={activeMenu === comment.id ? menuRef : null}>
                <button 
                  onClick={() => setActiveMenu(activeMenu === comment.id ? null : comment.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-full text-gray-500 transition-all"
                >
                  <MoreHorizontal size={16} />
                </button>

                {activeMenu === comment.id && (
                  <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-[#242526] shadow-xl rounded-lg border dark:border-[#3E4042] py-1 z-50 animate-in zoom-in-95">
                    <button 
                      onClick={() => { setShowDeleteModal({ show: true, id: comment.id }); setActiveMenu(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] font-semibold text-xs transition-colors"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-[#3E4042] bg-white dark:bg-[#242526]">
        <form onSubmit={handlePostComment} className="flex gap-2 items-center bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-4 py-2">
          <input 
            type="text" 
            placeholder="Escribe un comentario..." 
            className="flex-1 bg-transparent outline-none text-[15px] dark:text-white"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" disabled={!newComment.trim() || isSending} className="text-blue-600 disabled:opacity-30">
            <Send size={18} />
          </button>
        </form>
      </div>

      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[4000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#242526] w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#3E4042]">
            <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
              <h3 className="text-xl font-bold dark:text-white w-full text-center">¿Eliminar comentario?</h3>
              <button 
                onClick={() => setShowDeleteModal({ show: false, id: null })}
                className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] hover:bg-gray-200 dark:hover:bg-[#4E4F50] rounded-full text-gray-600 dark:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-[15px] text-gray-600 dark:text-gray-300">
              ¿Confirmas que quieres eliminar este comentario?
            </div>
            <div className="p-4 flex justify-end items-center gap-4">
              <button onClick={() => setShowDeleteModal({ show: false, id: null })} className="text-blue-600 font-bold hover:underline px-2">No</button>
              <button onClick={handleDeleteComment} className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}