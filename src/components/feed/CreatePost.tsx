import React, { useState, useRef } from 'react';

interface CreatePostProps {
  onPostSuccess: () => void;
}

export default function CreatePost({ onPostSuccess }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener nombre del usuario de la sesión
  const userSession = JSON.parse(localStorage.getItem("user_session") || "{}");
  const userName = userSession.name || "Vecino";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('user_id', userSession.id || 1);
    if (image) formData.append('image', image);

    try {
      const res = await fetch("/api/posts/save.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setContent('');
        setImage(null);
        setPreview(null);
        onPostSuccess(); // 🔄 Recarga el muro automáticamente
      }
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5 font-sans">
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          {userName[0]}
        </div>
        <textarea 
          className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 outline-none resize-none focus:bg-gray-200 transition-colors text-gray-700"
          placeholder={`¿Qué tienes en mente, ${userName}?`}
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {preview && (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-gray-100">
          <img src={preview} className="w-full max-h-72 object-cover" />
          <button 
            onClick={() => { setImage(null); setPreview(null); }}
            className="absolute top-2 right-2 bg-gray-900/60 text-white p-1 rounded-full hover:bg-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg transition text-green-600 font-semibold text-sm"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
          Foto/video
        </button>
        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
        
        <button 
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !image)}
          className={`px-8 py-2 rounded-lg font-bold transition-all ${
            loading || (!content.trim() && !image)
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
          }`}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </div>
  );
}