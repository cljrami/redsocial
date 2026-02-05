import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Smile, MapPin, Users, Globe } from 'lucide-react';
import CommentSection from './CommentSection';

export default function CreatePostModal({ isOpen, onClose, onPostSuccess, user, postToView }: any) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Si estamos viendo un post existente, usamos sus datos, si no, estamos creando uno nuevo
  const isViewing = !!postToView;

  const handlePost = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('user_id', user.id);
    if (image) formData.append('image', image);

    try {
      const res = await fetch("/api/posts/save.php", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setContent(''); setImage(null); setPreview(null);
        await onPostSuccess();
        onClose();
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-4 border-b text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isViewing ? 'Publicación' : 'Crear publicación'}
          </h2>
          <button onClick={onClose} className="absolute right-4 top-3.5 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {/* Info Usuario */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {isViewing ? postToView.full_name[0] : user.name[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{isViewing ? postToView.full_name : user.name}</p>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md text-[12px] font-bold text-gray-600">
                <Users size={12} /> Amigos <Globe size={10} />
              </div>
            </div>
          </div>

          {/* Contenido (Lectura o Edición) */}
          {isViewing ? (
            <div className="space-y-4">
              <p className="text-gray-800 text-lg">{postToView.content}</p>
              {postToView.image_url && (
                <img src={postToView.image_url} className="w-full rounded-xl border" />
              )}
              {/* SECCIÓN DE COMENTARIOS DENTRO DEL POPUP */}
              <div className="mt-6 border-t pt-4">
                <CommentSection postId={postToView.id} user={user} />
              </div>
            </div>
          ) : (
            <>
              <textarea 
                autoFocus
                className="w-full text-xl placeholder-gray-400 border-none focus:ring-0 min-h-[120px] resize-none"
                placeholder={`¿Qué estás pensando, ${user.name}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {preview && (
                <div className="relative mb-4 rounded-xl overflow-hidden border">
                   <img src={preview} className="w-full h-auto max-h-64 object-cover" />
                   <button onClick={() => {setImage(null); setPreview(null);}} className="absolute top-2 right-2 p-1.5 bg-white rounded-full"><X size={16}/></button>
                </div>
              )}
              <div className="border rounded-xl p-3 flex items-center justify-between mb-5">
                <span className="font-bold text-[15px]">Agregar a tu publicación</span>
                <div className="flex gap-1">
                   <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e:any) => {
                     const f = e.target.files?.[0];
                     if(f){ setImage(f); setPreview(URL.createObjectURL(f)); }
                   }} />
                   <button onClick={() => fileInputRef.current?.click()} className="p-2 text-green-500 hover:bg-gray-100 rounded-full"><ImageIcon size={24}/></button>
                </div>
              </div>
              <button 
                onClick={handlePost}
                disabled={loading || (!content.trim() && !image)}
                className="w-full py-2.5 rounded-lg font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] disabled:bg-gray-200"
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}