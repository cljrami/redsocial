import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Users, Globe } from 'lucide-react';
import CommentSection from './CommentSection';

export default function CreatePostModal({ isOpen, onClose, onPostSuccess, user, postToView }: any) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // NUEVOS ESTADOS: Para gestionar las sugerencias en el post [cite: 2026-02-05]
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!postToView) {
      setContent(''); setImage(null); setPreview(null);
      setShowSuggestions(false);
    }
  }, [isOpen, postToView]);

  // MANEJADOR DE TEXTO: Detecta el @ mientras escribes el post [cite: 2026-02-05]
  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    const atIndex = value.lastIndexOf('@');
    // Si hay un @ y no hay un espacio inmediatamente después [cite: 2026-02-05]
    if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
      const query = value.substring(atIndex + 1).split(/\s/)[0];
      if (query.length >= 2) {
        try {
          const res = await fetch(`/api/users/search.php?q=${query}`);
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) { console.error(err); }
      } else { setShowSuggestions(false); }
    } else { setShowSuggestions(false); }
  };

  const selectUser = (name: string) => {
    const atIndex = content.lastIndexOf('@');
    const baseText = content.substring(0, atIndex);
    setContent(baseText + '@' + name + ' '); // Inserta el nombre seleccionado [cite: 2026-02-05]
    setShowSuggestions(false);
  };

  if (!isOpen) return null;
  const isViewing = !!postToView;

  const handlePost = async () => {
    if (!content.trim() && !image) return;
    if (!user.id || user.id === 0) { alert("Sesión no válida"); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('user_id', user.id.toString()); 
    if (image) formData.append('image', image);

    try {
      const res = await fetch("/api/posts/save.php", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        await onPostSuccess();
        onClose();
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-white/90 dark:bg-[#1c1c1d]/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#242526] w-full max-w-[600px] rounded-2xl shadow-2xl border dark:border-[#3E4042] flex flex-col overflow-hidden max-h-[90vh] relative">
        
        {/* MENÚ DE SUGERENCIAS FLOTANTE (Para el Post) [cite: 2026-02-05] */}
        {showSuggestions && suggestions.length > 0 && !isViewing && (
          <div className="absolute top-[180px] left-6 w-72 bg-white dark:bg-[#242526] shadow-2xl rounded-xl border dark:border-[#3E4042] py-2 z-[120] animate-in zoom-in-95">
            <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mencionar a:</p>
            {suggestions.map((s) => (
              <button 
                key={s.id} 
                onClick={() => selectUser(s.full_name)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 dark:hover:bg-[#3A3B3C] text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border">
                  {s.profile_photo ? <img src={s.profile_photo} className="w-full h-full object-cover" /> : s.full_name[0]}
                </div>
                <span className="text-sm font-bold dark:text-white">{s.full_name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center relative">
          <h2 className="text-xl font-bold w-full text-center dark:text-white">
            {isViewing ? 'Publicación' : 'Crear publicación'}
          </h2>
          <button onClick={onClose} className="absolute right-4 top-3.5 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border">
              {(isViewing ? postToView.profile_photo : user.profile_photo) ? (
                <img src={isViewing ? postToView.profile_photo : user.profile_photo} className="w-full h-full object-cover" />
              ) : (isViewing ? postToView.full_name : user.name)?.[0]}
            </div>
            <div>
              <p className="font-semibold dark:text-white">{isViewing ? postToView.full_name : user.name}</p>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#3A3B3C] px-2 py-0.5 rounded text-[12px] font-bold dark:text-gray-300">
                <Users size={12} /> Amigos
              </div>
            </div>
          </div>

          {isViewing ? (
            <div className="space-y-4">
              <p className="text-gray-800 dark:text-gray-200 text-lg leading-normal">{postToView.content}</p>
              {postToView.image_url && <img src={postToView.image_url} className="w-full rounded-xl border dark:border-[#3E4042]" />}
              <div className="mt-6 border-t dark:border-[#3E4042] pt-4"><CommentSection postId={postToView.id} user={user} /></div>
            </div>
          ) : (
            <>
              <textarea 
                autoFocus
                className="w-full text-lg border-none focus:ring-0 min-h-[150px] resize-none dark:bg-transparent dark:text-white"
                placeholder={`¿Qué estás pensando, ${user.name}?`}
                value={content}
                onChange={handleContentChange} // Activamos la detección de menciones [cite: 2026-02-05]
              />
              {preview && (
                <div className="relative mb-4">
                  <img src={preview} className="w-full h-48 object-cover rounded-xl border dark:border-[#3E4042]" />
                  <button onClick={() => {setImage(null); setPreview(null);}} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X size={16}/></button>
                </div>
              )}
              <div className="border dark:border-[#3E4042] rounded-xl p-3 flex justify-between items-center mb-4">
                <span className="font-bold dark:text-white">Agregar a tu publicación</span>
                <button onClick={() => fileInputRef.current?.click()} className="text-green-500 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] p-2 rounded-full">
                  <ImageIcon size={24}/>
                  <input type="file" hidden ref={fileInputRef} onChange={(e:any) => {
                    const f = e.target.files?.[0];
                    if(f){ setImage(f); setPreview(URL.createObjectURL(f)); }
                  }} />
                </button>
              </div>
              <button onClick={handlePost} disabled={loading || (!content.trim() && !image)} className="w-full py-2.5 bg-[#1877F2] text-white font-bold rounded-lg disabled:bg-gray-200">
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}