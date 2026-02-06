import React from 'react';
import { X } from 'lucide-react';
import CommentSection from './CommentSection';

export default function CommentModal({ isOpen, onClose, post }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-0 md:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#242526] w-full max-w-[700px] h-full md:h-[90vh] rounded-none md:rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header del Modal */}
        <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center bg-white dark:bg-[#242526] z-10">
          <h3 className="text-xl font-bold dark:text-white w-full text-center">Publicación de {post.full_name}</h3>
          <button onClick={onClose} className="absolute right-4 p-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors">
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenido: Post + Comentarios */}
        <div className="flex-1 overflow-y-auto">
          {/* Mini-preview del post para contexto */}
          <div className="p-4 border-b dark:border-[#3E4042] bg-gray-50 dark:bg-black/10">
            <p className="text-[15px] dark:text-gray-200">{post.content}</p>
          </div>
          
          {/* SECCIÓN REAL DE COMENTARIOS */}
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}