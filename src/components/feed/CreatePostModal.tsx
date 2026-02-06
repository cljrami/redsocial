import React, { useState, useRef, useEffect } from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import CommentSection from './CommentSection';
import MentionSuggestions from './MentionSuggestions';

export default function CreatePostModal({ isOpen, onClose, onPostSuccess, user, postToView }: any) {
  const [content, setContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // EFECTO PARA BLOQUEAR SCROLL DEL BODY
  useEffect(() => {
    if (isOpen) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const handleText = async (e: any) => {
    const val = e.target.value; setContent(val);
    const cursor = e.target.selectionStart;
    const lastAt = val.substring(0, cursor).lastIndexOf('@');
    
    if (lastAt !== -1 && !val.substring(lastAt, cursor).includes(' ')) {
      const rect = textareaRef.current?.getBoundingClientRect();
      // POSICIÓN ABSOLUTA PARA QUE NO DESPLACE EL CONTENIDO
      setMentionPosition({ top: (rect?.top || 0) + 40, left: (rect?.left || 0) + 20 });
      
      const q = val.substring(lastAt + 1, cursor);
      if (q.length > 0) {
        const res = await fetch(`/api/users/search.php?q=${q}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } else setShowSuggestions(false);
    } else setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-scrollbar">
      
      {/* VENTANA DE MENCIONES CON POSICIÓN FIXED Y Z-INDEX MÁXIMO */}
      {showSuggestions && (
        <div className="fixed z-[10000]" style={{ top: mentionPosition.top, left: mentionPosition.left }}>
          <MentionSuggestions users={suggestions} onSelect={(u: any) => {
             const lastAt = content.lastIndexOf('@');
             setContent(content.substring(0, lastAt) + '@' + u.full_name + ' ');
             setShowSuggestions(false);
             textareaRef.current?.focus();
          }} />
        </div>
      )}

      <div className="bg-white dark:bg-[#242526] w-full max-w-[550px] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] border dark:border-[#3E4042]">
        <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center bg-white dark:bg-[#242526] z-10">
          <h2 className="text-center w-full font-bold text-xl dark:text-white">{postToView ? 'Publicación' : 'Crear publicación'}</h2>
          <button onClick={onClose} className="p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white cursor-pointer hover:bg-gray-200"><X size={20}/></button>
        </div>

        <div className="p-4 overflow-y-auto no-scrollbar">
          {/* Cabecera de usuario clicable */}
          <div className="flex items-center gap-3 mb-4 cursor-pointer">
            <img src={(postToView?.profile_photo || user.profile_photo) || '/default-avatar.jpg'} className="w-10 h-10 rounded-full object-cover border" />
            <div>
              <p className="font-bold dark:text-white hover:underline">{postToView?.full_name || user.name}</p>
              <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 dark:bg-[#3A3B3C] px-2 py-0.5 rounded w-fit dark:text-gray-300"><Users size={12}/> Amigos</span>
            </div>
          </div>

          {postToView ? (
            <div className="space-y-4">
              <p className="dark:text-white text-lg leading-snug">{postToView.content}</p>
              {postToView.image_url && <img src={postToView.image_url} className="w-full rounded-lg border dark:border-[#3E4042]" />}
              <div className="border-t dark:border-[#3E4042] pt-2">
                <CommentSection postId={postToView.id} user={user} />
              </div>
            </div>
          ) : (
            <>
              <textarea ref={textareaRef} value={content} onChange={handleText} placeholder={`¿Qué piensas, ${user.name}?`} className="w-full min-h-[150px] border-none focus:ring-0 text-lg dark:bg-transparent dark:text-white resize-none no-scrollbar" />
              <button className="w-full py-2.5 bg-[#1877F2] text-white font-bold rounded-lg mt-4 cursor-pointer hover:bg-blue-600 transition-colors">Publicar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}