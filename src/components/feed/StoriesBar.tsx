import React, { useState, useRef } from 'react';
import { Plus, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';
// 1. Importamos Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// IMPORTANTE: Asegúrate de que estos estilos se carguen
import 'swiper/css';
import 'swiper/css/navigation';

export default function StoriesBar({ stories, user }: any) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user.id) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('story_image', selectedImage);
    fd.append('user_id', String(user.id));
    fd.append('caption', caption);

    try {
      const res = await fetch('/api/stories/upload_story.php', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setPreviewUrl(null);
        setSelectedImage(null);
        setCaption("");
        window.dispatchEvent(new Event('user_session_updated'));
      }
    } catch (e) { console.error(e); } finally { setIsUploading(false); }
  };

  return (
    <div className="w-full relative group mb-4 select-none">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* CARRUSEL CONFIGURADO */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView="auto" // Crucial para que respeten el ancho de 110px
        grabCursor={true}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        className="!static" // Evita que las flechas se pierdan en el overflow
      >
        {/* SLIDE: CREAR HISTORIA */}
        <SwiperSlide className="!w-[110px]">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-[110px] h-[190px] rounded-xl bg-white dark:bg-[#242526] shadow-md border border-gray-200 dark:border-[#3E4042] overflow-hidden group/card cursor-pointer"
          >
            <div className="h-[145px] w-full overflow-hidden">
              <img src={user.profile_photo || '/default-avatar.jpg'} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
            </div>
            <div className="h-[45px] flex items-end justify-center pb-2 bg-white dark:bg-[#242526]">
              <span className="text-[12px] font-bold dark:text-white leading-tight">Crear historia</span>
            </div>
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
              <div className="bg-[#1877F2] p-1.5 rounded-full border-[4px] border-white dark:border-[#242526]">
                <Plus size={20} className="text-white" strokeWidth={4} />
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDES: HISTORIAS ACTIVAS */}
        {stories.map((story: any) => (
          <SwiperSlide key={story.id} className="!w-[110px]">
            <div className="relative w-[110px] h-[190px] rounded-xl overflow-hidden shadow-md group/item cursor-pointer">
              <img src={story.image_url} className="w-full h-full object-cover group-hover/item:scale-105 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-[3px] border-[#1877F2] p-[2px] bg-white">
                <img src={story.user_photo || '/default-avatar.jpg'} className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold truncate">
                {story.full_name}
              </span>
            </div>
          </SwiperSlide>
        ))}

        {/* FLECHAS DE NAVEGACIÓN (Fuera del flujo de slides) */}
        <button className="swiper-button-prev-custom absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-[#3E4042] rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden border dark:border-gray-600">
          <ChevronLeft size={24} />
        </button>
        <button className="swiper-button-next-custom absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-[#3E4042] rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden border dark:border-gray-600">
          <ChevronRight size={24} />
        </button>
      </Swiper>

      {/* MODAL DE PREVIEW */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex flex-col items-center justify-center p-4">
          <button onClick={() => { setPreviewUrl(null); setSelectedImage(null); }} className="absolute top-5 right-5 text-white/70 bg-white/10 p-2 rounded-full"><X size={30} /></button>
          <div className="relative w-full max-w-[350px] h-[600px] rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl">
            <img src={previewUrl} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Escribe algo..."
                className="w-full bg-transparent text-white text-2xl font-bold border-none focus:ring-0 resize-none placeholder:text-white/30"
                rows={4}
                autoFocus
              />
            </div>
          </div>
          <div className="mt-8 flex gap-4 w-full max-w-[350px]">
             <button onClick={() => { setPreviewUrl(null); setSelectedImage(null); }} className="flex-1 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors">Descartar</button>
             <button onClick={handleUpload} disabled={isUploading} className="flex-[2] bg-[#1877F2] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#166fe5] transition-all active:scale-95">
               {isUploading ? 'Publicando...' : <><Send size={20} /> Compartir ahora</>}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}