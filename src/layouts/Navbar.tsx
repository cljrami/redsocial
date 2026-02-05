import React, { useState, useEffect } from 'react';
import { Search, Home, Bell, MessageCircle, ChevronDown, Moon, Sun, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [adminData, setAdminData] = useState({ name: "Administrador", photo: null });

  const loadSession = () => {
    const session = localStorage.getItem("user_session");
    if (session) {
      const userData = JSON.parse(session);
      setAdminData({ 
        name: userData.name || "Administrador", 
        photo: userData.profile_photo || null 
      });
    }
  };

  useEffect(() => {
    loadSession();
    // Escuchar si la foto cambia en el perfil para actualizar aquí sin recargar
    window.addEventListener('user_session_updated', loadSession);
    
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    
    return () => window.removeEventListener('user_session_updated', loadSession);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <nav className="fixed top-0 z-[150] w-full bg-white dark:bg-[#242526] shadow-sm border-b border-gray-200 dark:border-[#3E4042] h-14 flex items-center px-4 justify-between transition-colors">
      <div className="flex items-center gap-2 flex-1">
        <div className="bg-blue-600 rounded-full p-1 cursor-pointer" onClick={() => window.location.href = '/feed'}>
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </div>
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-3 py-2 gap-2 w-64">
          <Search size={18} className="text-gray-500" />
          <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-[15px] w-full dark:text-gray-200" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <button className="p-2 bg-gray-200 dark:bg-[#3A3B3C] dark:text-white rounded-full"><Bell size={20} /></button>
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#4E4F50] p-1 rounded-full relative">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-200 overflow-hidden shadow-sm">
               {adminData.photo ? <img src={adminData.photo} className="w-full h-full object-cover" /> : "A"}
            </div>
            <ChevronDown size={14} className="dark:text-white" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3E4042] p-2">
              <a href="/perfil" className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                   {adminData.photo ? <img src={adminData.photo} className="w-full h-full object-cover" /> : "A"}
                </div>
                <div>
                  <p className="font-bold dark:text-white">{adminData.name}</p>
                  <p className="text-sm text-gray-500">Ver perfil</p>
                </div>
              </a>
              <hr className="my-2 dark:border-[#3E4042]" />
              <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg dark:text-white font-medium">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>Modo {darkMode ? 'Claro' : 'Oscuro'}</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg text-red-600 font-medium">
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}