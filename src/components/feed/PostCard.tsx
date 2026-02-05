import React from 'react';
import { ThumbsUp, MessageCircle, Share2, FileText } from 'lucide-react';

export default function PostCard({ post, onOpenComments }: any) {
  const isPDF = post.image_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4">
      {/* Header del post... */}
      <div className="p-4">{/* ... código del header ... */}</div>

      <div className="px-4 pb-3 text-gray-800 dark:text-gray-200">{post.content}</div>

      {/* RENDER DE ARCHIVO (PDF o IMAGEN) */}
      {post.image_url && (
        <div className="cursor-pointer bg-gray-50 dark:bg-[#3A3B3C] border-y dark:border-[#3E4042]" onClick={onOpenComments}>
          {isPDF ? (
            <div className="flex items-center gap-4 p-6 bg-gray-100 dark:bg-[#4E4F50] rounded-xl m-4 border dark:border-[#3E4042]">
              <div className="p-3 bg-red-100 rounded-lg text-red-600"><FileText size={40} /></div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold dark:text-white truncate">Documento Adjunto</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Haga clic para ver detalles</p>
              </div>
            </div>
          ) : (
            <img src={post.image_url} className="w-full max-h-[500px] object-contain" />
          )}
        </div>
      )}

      {/* Estadísticas y Botones (Like, Comentar)... */}
      {/* ... código de botones ... */}
    </div>
  );
}