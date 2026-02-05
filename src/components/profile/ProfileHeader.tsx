import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function ProfileHeader() {
  const [userData, setUserData] = useState({
    profile_photo: '',
    cover_photo: '',
    name: 'Administrador'
  });

  const syncData = () => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    setUserData({
      profile_photo: session.profile_photo || '',
      cover_photo: session.cover_photo || '',
      name: session.name || 'Administrador'
    });
  };

  useEffect(() => {
    syncData();
    window.addEventListener('user_session_updated', syncData);
    return () => window.removeEventListener('user_session_updated', syncData);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    formData.append('user_id', '1');

    try {
      const res = await fetch('/api/user/update_photos.php', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        const session = JSON.parse(localStorage.getItem("user_session") || "{}");
        session[type === 'profile' ? 'profile_photo' : 'cover_photo'] = data.url;
        localStorage.setItem("user_session", JSON.stringify(session));
        
        // Notifica al Navbar y al resto de la app del cambio de foto
        window.dispatchEvent(new Event('user_session_updated'));
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#242526] shadow-sm border-b dark:border-[#3E4042]">
      <div className="max-w-[940px] mx-auto">
        
        {/* FOTO DE PORTADA */}
        <div className="h-[200px] md:h-[350px] bg-gray-200 dark:bg-[#3A3B3C] relative overflow-hidden md:rounded-b-xl">
          {userData.cover_photo && (
            <img src={userData.cover_photo} className="w-full h-full object-cover" alt="Portada" />
          )}
          <label className="absolute bottom-4 right-4 bg-white dark:bg-[#4E4F50] px-4 py-2 rounded-lg shadow-md cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#5E5F60] transition-all font-bold dark:text-white z-20">
            <Camera size={20} />
            <span className="hidden md:inline text-sm">Editar foto de portada</span>
            <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'cover')} accept="image/*" />
          </label>
        </div>

        {/* ÁREA DE AVATAR Y DATOS (Avatar pisa la portada) */}
        <div className="px-4 pb-6 flex flex-col items-center md:items-end md:flex-row -mt-12 md:-mt-16 relative z-10 gap-4">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#242526] bg-gray-800 overflow-hidden shadow-xl flex items-center justify-center text-white text-5xl font-bold">
              {userData.profile_photo ? (
                <img src={userData.profile_photo} className="w-full h-full object-cover" alt="Perfil" />
              ) : "A"}
            </div>
            {/* ICONO DE CÁMARA EN AVATAR */}
            <label className="absolute bottom-2 right-2 bg-gray-200 dark:bg-[#3A3B3C] p-2 rounded-full border-4 border-white dark:border-[#242526] cursor-pointer shadow-md hover:scale-110 transition-transform z-20 flex items-center justify-center">
              <Camera size={20} className="dark:text-white text-gray-700" />
              <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'profile')} accept="image/*" />
            </label>
          </div>
          
          <div className="text-center md:text-left flex-1 pb-2">
            <h1 className="text-3xl font-extrabold dark:text-white">Administrador</h1>
            {/* CONTADORES EN 0 */}
            <p className="text-gray-500 dark:text-gray-400 font-bold">0 seguidores • 0 seguidos</p>
          </div>
        </div>
      </div>
    </div>
  );
}