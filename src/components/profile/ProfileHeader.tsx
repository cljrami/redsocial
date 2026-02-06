import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function ProfileHeader() {
  const [userData, setUserData] = useState<any>({ id: null, name: 'Usuario', profile_photo: '', cover_photo: '' });
  const [tempProfile, setTempProfile] = useState<File | null>(null);
  const [tempCover, setTempCover] = useState<File | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string>('');
  const [previewCover, setPreviewCover] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const syncData = () => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    setUserData({
      id: session.id || null,
      name: session.name || session.full_name || 'Usuario',
      profile_photo: session.profile_photo || '',
      cover_photo: session.cover_photo || ''
    });
  };

  useEffect(() => {
    syncData();
    window.addEventListener('user_session_updated', syncData);
    return () => window.removeEventListener('user_session_updated', syncData);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        setTempProfile(file);
        setPreviewProfile(reader.result as string);
      } else {
        setTempCover(file);
        setPreviewCover(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setTempProfile(null);
    setTempCover(null);
    setPreviewProfile('');
    setPreviewCover('');
  };

  const handleSave = async () => {
    if (!userData.id) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append('user_id', userData.id);
    const type = tempProfile ? 'profile' : 'cover'; 
    
    if (tempProfile) formData.append('photo', tempProfile);
    else if (tempCover) formData.append('photo', tempCover);
    formData.append('type', type);

    try {
      const res = await fetch('/api/user/update_photos.php', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        const session = JSON.parse(localStorage.getItem("user_session") || "{}");
        if (tempProfile) session.profile_photo = data.url;
        if (tempCover) session.cover_photo = data.url;
        localStorage.setItem("user_session", JSON.stringify(session));

        // --- PUBLICACIÓN AUTOMÁTICA ---
        const postMsg = type === 'profile' 
          ? "actualizó su foto de perfil." 
          : "actualizó su foto de portada.";

        const postData = new FormData();
        postData.append('user_id', userData.id);
        postData.append('content', postMsg);
        postData.append('image_url', data.url); 

        await fetch('/api/posts/save.php', { method: 'POST', body: postData });

        window.dispatchEvent(new Event('user_session_updated'));
        handleCancel();
      }
    } catch (err) { console.error("Error al guardar:", err); }
    setIsSaving(false);
  };

  return (
    <div className="bg-white dark:bg-[#242526] shadow-sm border-b dark:border-[#3E4042] relative">
      {(previewProfile || previewCover) && (
        <div className="fixed top-14 inset-x-0 z-[100] bg-blue-600 text-white py-3 px-4 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="max-w-[940px] mx-auto flex justify-between items-center">
            <p className="font-medium">¿Deseas guardar los cambios en tus fotos?</p>
            <div className="flex gap-3">
              <button onClick={handleCancel} className="px-4 py-1.5 rounded-md hover:bg-white/10 font-bold">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-white text-blue-600 px-4 py-1.5 rounded-md font-bold shadow-sm">
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[940px] mx-auto">
        <div className="h-[200px] md:h-[350px] bg-gray-200 dark:bg-[#3A3B3C] relative overflow-hidden md:rounded-b-xl group">
          <img src={previewCover || userData.cover_photo} className="w-full h-full object-cover" />
          <label className="absolute bottom-4 right-4 bg-white dark:bg-[#4E4F50] px-4 py-2 rounded-lg shadow-md cursor-pointer flex items-center gap-2 font-bold dark:text-white z-20 hover:bg-gray-100 transition-colors">
            <Camera size={20} /> <span className="hidden md:inline text-sm">Editar foto de portada</span>
            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
          </label>
        </div>

        <div className="px-4 pb-6 flex flex-col items-center md:items-end md:flex-row -mt-12 md:-mt-16 relative z-10 gap-4">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#242526] bg-gray-800 overflow-hidden shadow-xl">
              <img src={previewProfile || userData.profile_photo} className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-2 right-2 bg-gray-200 dark:bg-[#3A3B3C] p-2 rounded-full border-4 border-white dark:border-[#242526] cursor-pointer shadow-md hover:bg-gray-300 transition-colors">
              <Camera size={20} className="dark:text-white" />
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} />
            </label>
          </div>
          <div className="text-center md:text-left flex-1 pb-2">
            <h1 className="text-3xl font-extrabold dark:text-white">{userData.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold">Residente Verificado</p>
          </div>
        </div>
      </div>
    </div>
  );
}