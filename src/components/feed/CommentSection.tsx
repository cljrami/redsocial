import React, { useState, useEffect } from 'react';
import { Send, Loader2, ThumbsUp, X } from 'lucide-react';

export default function CommentSection({ postId, user }: { postId: number; user: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/get_comments.php?post_id=${postId}&user_id=${user.id}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Error:", e); }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  // --- FUNCIÓN PARA BORRAR CON POPUP ---
  const handleDelete = async (commentId: number) => {
    // El "Popup" de confirmación nativo (más seguro y rápido)
    const confirmar = window.confirm("¿Estás seguro de que deseas ELIMINAR este comentario? Esta acción no se puede deshacer.");
    
    if (confirmar) {
      try {
        const res = await fetch(`/api/comments/delete.php?id=${commentId}&user_id=${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchComments(); // Recargar lista
          window.dispatchEvent(new Event('user_session_updated')); // Actualizar contador global
        }
      } catch (e) { console.error("Error al borrar:", e); }
    }
  };

  const handleSend = async () => {
    if (!newComment.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id,
          content: newComment,
          parent_id: replyingTo?.id || null // Enviamos el ID del padre si es respuesta
        })
      });
      if ((await res.json()).success) {
        setNewComment("");
        setReplyingTo(null); // Limpiar estado de respuesta
        fetchComments();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const renderComment = (c: any, isReply = false) => (
    <div key={c.id} className={`${isReply ? 'ml-10 mt-2 border-l-2 border-blue-100 dark:border-[#3E4042] pl-3' : 'mt-4'} group animate-in fade-in duration-300`}>
      <div className="flex gap-2">
        <img src={c.profile_photo || '/default-avatar.jpg'} className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full object-cover cursor-pointer`} />
        
        <div className="flex flex-col flex-1">
          <div className="relative w-fit max-w-full">
            <div className="bg-gray-100 dark:bg-[#3A3B3C] rounded-2xl px-3 py-1.5 shadow-sm">
              <p className="text-[12px] font-bold dark:text-white cursor-pointer hover:underline">{c.full_name}</p>
              <p className="text-[14px] dark:text-gray-200 leading-snug">{c.content}</p>
            </div>
            
            {/* Contador de Likes a la derecha */}
            {parseInt(c.likes_count) > 0 && (
              <div className="absolute -right-3 -bottom-1 bg-white dark:bg-[#242526] shadow-md border dark:border-[#3E4042] rounded-full px-1 py-0.5 flex items-center gap-0.5 scale-90">
                <div className="bg-blue-500 rounded-full p-0.5"><ThumbsUp size={8} className="text-white" fill="white" /></div>
                <span className="text-[10px] font-bold dark:text-gray-300">{c.likes_count}</span>
              </div>
            )}
          </div>

          {/* BARRA DE ACCIONES */}
          <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
            <button className="hover:underline cursor-pointer active:scale-95 transition-transform">Me gusta</button>
            
            {/* Al hacer clic en responder, activamos el popup sobre el input */}
            <button 
              onClick={() => setReplyingTo({ id: c.id, name: c.full_name })} 
              className="hover:underline cursor-pointer"
            >
              Responder
            </button>
            
            <span className="font-normal opacity-70">Hace un momento</span>

            {/* BOTÓN BORRAR (TEXTO) */}
            {(user.id == c.user_id || user.role === 'admin') && (
              <button 
                onClick={() => handleDelete(c.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer uppercase text-[10px]"
              >
                Borrar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RENDERIZAR RESPUESTAS (HILOS) */}
      {comments.filter(r => r.parent_id == c.id).map(r => renderComment(r, true))}
    </div>
  );

  return (
    <div className="mt-4 flex flex-col no-scrollbar">
      {/* Lista de comentarios principales */}
      <div className="max-h-80 overflow-y-auto no-scrollbar pr-1">
        {comments.filter(c => !c.parent_id || c.parent_id == "0").map(c => renderComment(c))}
      </div>

      {/* ÁREA DE ESCRITURA */}
      <div className="mt-4 pt-2 border-t dark:border-[#3E4042]">
        
        {/* POPUP DE "RESPONDIENDO A..." */}
        {replyingTo && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 mb-2 rounded-lg border border-blue-100 dark:border-blue-800 animate-in slide-in-from-bottom-1">
            <span className="text-[11px] dark:text-blue-200">
              Respondiendo a <span className="font-bold">@{replyingTo.name}</span>
            </span>
            <button 
              onClick={() => setReplyingTo(null)} 
              className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800 p-0.5 rounded-full cursor-pointer"
            >
              <X size={14}/>
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <img src={user.profile_photo || '/default-avatar.jpg'} className="w-8 h-8 rounded-full object-cover" />
          <div className="flex-1 relative">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={replyingTo ? `Escribe una respuesta...` : "Escribe un comentario..."}
              className="w-full bg-gray-100 dark:bg-[#3A3B3C] dark:text-white rounded-full py-2 px-4 pr-10 text-sm border-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button 
              onClick={handleSend} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1877F2] hover:scale-110 transition-transform cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}