import React, { useState, useRef, useEffect } from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import MentionSuggestions from './MentionSuggestions';

export default function CreatePostModal({ isOpen, onClose, user }: any) {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Bloquear scroll del fondo
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    const cursor = e.target.selectionStart;
    const textBefore = val.substring(0, cursor);
    const lastAt = textBefore.lastIndexOf('@');

    // Si hay un @ y no hay espacios después de él hasta el cursor
    if (lastAt !== -1 && !textBefore.substring(lastAt, cursor).includes(' ')) {
      const query = textBefore.substring(lastAt + 1);
      
      if (query.length >= 1) {
        // Cálculo de posición corregido
        const rect = textareaRef.current?.getBoundingClientRect();
        if (rect) {
          setMentionPosition({
            top: rect.top + 40, // Aparece justo debajo de la línea de escritura
            left: rect.left + 20
          });
        }

        const res = await fetch(`/api/users/search.php?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const insertMention = (u: any) => {
    const cursor = textareaRef.current?.selectionStart || 0;
    const lastAt = content.substring(0, cursor).lastIndexOf('@');
    const textBefore = content.substring(0, lastAt);
    const textAfter = content.substring(cursor);
    
    // Insertamos la mención y un espacio
    const newContent = textBefore + '@' + u.full_name + ' ' + textAfter;
    setContent(newContent);
    setShowSuggestions(false);
    
    // Devolver el foco al textarea
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-scrollbar">
      
      {/* VENTANA FLOTANTE DE MENCIONES (POR FUERA DEL MODAL PARA QUE NO MOLESTE) */}
      {showSuggestions && (
        <MentionSuggestions 
          users={suggestions} 
          onSelect={insertMention} 
          position={mentionPosition} 
        />
      )}

      <div className="bg-white dark:bg-[#242526] w-full max-w-[550px] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* Cabecera */}
        <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center bg-white dark:bg-[#242526] sticky top-0 z-10">
          <h2 className="text-center w-full font-bold text-xl dark:text-white">Crear publicación</h2>
          <button onClick={onClose} className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white cursor-pointer hover:bg-gray-200 transition-colors">
            <X size={20}/>
          </button>
        </div>

        <div className="p-4 overflow-y-auto no-scrollbar">
          {/* Usuario */}
          <div className="flex items-center gap-3 mb-4">
            <img src={user.profile_photo || '/default-avatar.jpg'} className="w-10 h-10 rounded-full object-cover border" alt="" />
            <div>
              <p className="font-bold dark:text-white">{user.name}</p>
              <span className="flex items-center gap-1 text-[11px] font-bold bg-gray-100 dark:bg-[#3A3B3C] px-2 py-0.5 rounded w-fit dark:text-gray-300">
                <Users size={12}/> Amigos
              </span>
            </div>
          </div>

          {/* Área de Texto */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            placeholder={`¿Qué tienes en mente, ${user.name}?`}
            className="w-full min-h-[150px] border-none focus:ring-0 text-lg dark:bg-transparent dark:text-white resize-none no-scrollbar"
          />

          <button className="w-full py-2.5 bg-[#1877F2] text-white font-bold rounded-lg mt-4 cursor-pointer hover:bg-blue-600 shadow-lg active:scale-[0.98] transition-all">
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}