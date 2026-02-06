import React, { useState, useEffect, useRef } from 'react';
import { Bell, Home, Search, Settings, HelpCircle, Moon, LogOut, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>({});
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    if (!session.id) return;
    setUser(session);
    try {
      const res = await fetch(`/api/notifications/get.php?user_id=${session.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        const unread = data.filter((n: any) => parseInt(n.is_read) === 0).length;
        setUnreadCount(unread);
      }
    } catch (e) { console.error("Error al obtener notificaciones:", e); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Solo guardamos si el objeto user tiene datos válidos [cite: 2026-02-05]
    if (user && (user.full_name || user.name)) {
      const lastUser = {
        name: user.full_name || user.name,
        photo: user.profile_photo || null,
        username: user.username || user.full_name || user.name
      };
      localStorage.setItem("last_logged_user", JSON.stringify(lastUser));
    }

    localStorage.removeItem("user_session");
    window.location.href = "/"; 
  };

  const handleOpenNotifs = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState) setIsProfileOpen(false);

    if (nextState && unreadCount > 0) {
      const fd = new FormData();
      fd.append('user_id', user.id);
      try {
        const res = await fetch('/api/notifications/mark_read.php', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) setUnreadCount(0);
      } catch (e) { console.error("Error al marcar como leídas:", e); }
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-14 bg-white dark:bg-[#242526] border-b dark:border-[#3E4042] z-[500] px-4 flex items-center justify-between font-sans shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white font-black text-xl">F</div>
        <div className="hidden sm:flex items-center bg-gray-100 dark:bg-[#3A3B3C] px-3 py-2 rounded-full gap-2">
          <Search size={18} className="text-gray-500" />
          <input type="text" placeholder="Buscar..." className="bg-transparent outline-none text-sm dark:text-white w-24 md:w-48" />
        </div>
      </div>

      <div className="flex items-center h-full">
        <a href="/feed" className="h-full px-6 md:px-12 flex items-center border-b-4 border-blue-600 text-blue-600 transition-all">
          <Home size={28} />
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={handleOpenNotifs} className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 dark:bg-[#3A3B3C] text-gray-700 dark:text-gray-200 hover:bg-gray-300'}`}>
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white dark:border-[#242526] animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} className={`w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 transition-all ${isProfileOpen ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}>
            {user.profile_photo ? <img src={user.profile_photo} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full font-bold text-gray-600 dark:text-gray-300 uppercase">{(user.full_name?.[0] || user.name?.[0] || 'U')}</div>}
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#242526] shadow-2xl rounded-xl border dark:border-[#3E4042] p-2 animate-in fade-in zoom-in-95 z-[600]">
              <a href="/perfil" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3B3C] transition-colors mb-2 shadow-sm border dark:border-[#3E4042]">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                   {user.profile_photo ? <img src={user.profile_photo} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full font-bold">{(user.full_name?.[0] || user.name?.[0] || 'U')}</div>}
                </div>
                <span className="font-bold text-[17px] dark:text-white truncate">{user.full_name || user.name || "Usuario"}</span>
              </a>
              <div className="border-t dark:border-[#3E4042] my-2"></div>
              <MenuOption icon={<Settings size={20}/>} title="Configuración y privacidad" />
              <MenuOption icon={<HelpCircle size={20}/>} title="Ayuda y soporte técnico" />
              <MenuOption icon={<Moon size={20}/>} title="Pantalla y accesibilidad" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3B3C] transition-colors mt-1">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#4E4F50] flex items-center justify-center dark:text-white">
                  <LogOut size={20} />
                </div>
                <span className="font-semibold text-[15px] dark:text-white">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MenuOption({ icon, title }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3B3C] cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#4E4F50] flex items-center justify-center dark:text-white">{icon}</div>
        <span className="font-semibold text-[15px] dark:text-white">{title}</span>
      </div>
      <ChevronRight size={18} className="text-gray-500 group-hover:text-gray-700" />
    </div>
  );
}