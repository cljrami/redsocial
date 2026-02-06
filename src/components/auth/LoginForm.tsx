import React, { useState, useEffect } from 'react';

export default function LoginForm() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [recentUser, setRecentUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("last_logged_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) setRecentUser(parsed);
      } catch (e) { console.error("Error al cargar usuario reciente"); }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent, customUser?: string) => {
    e.preventDefault();
    const loginData = { 
      user: customUser || user, 
      pass: pass 
    };

    try {
      const res = await fetch("/api/auth/login.php", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("user_session", JSON.stringify(data.user));
        window.location.href = "/feed";
      } else {
        alert(data.message || "Contraseña incorrecta");
      }
    } catch (error) { console.error("Error:", error); }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-sans">
      <div className="max-w-[980px] w-full px-4 flex flex-col lg:flex-row items-center justify-between gap-12 lg:mb-24">
        
        <div className="lg:w-[580px] text-center lg:text-left">
          <h1 className="text-[#1877f2] text-6xl font-black tracking-tighter mb-4">facebook</h1>
          
          {recentUser && recentUser.name ? (
            <div>
              <h2 className="text-[28px] text-[#1c1e21] font-medium leading-8">Inicios de sesión recientes</h2>
              <p className="text-[#606770] text-[15px] mb-5">Haz clic en tu foto o añade una cuenta.</p>
              
              <div className="flex gap-4 justify-center lg:justify-start">
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="w-40 h-52 bg-white rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                >
                  <div className="h-40 overflow-hidden bg-gray-100">
                    {recentUser.photo ? (
                      <img src={recentUser.photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-4xl">
                        {recentUser.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="h-12 flex items-center justify-center font-semibold text-gray-700">
                    {recentUser.name.split(' ')[0]}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[28px] leading-8 text-[#1c1e21] font-medium lg:pr-10">
              Facebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.
            </p>
          )}
        </div>

        <div className="w-full max-w-[396px]">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
              <input type="text" placeholder="Correo electrónico o número de teléfono" className="w-full p-3.5 border border-gray-300 rounded-md outline-none focus:border-[#1877f2]" value={user} onChange={(e) => setUser(e.target.value)} required />
              <input type="password" placeholder="Contraseña" className="w-full p-3.5 border border-gray-300 rounded-md outline-none focus:border-[#1877f2]" onChange={(e) => setPass(e.target.value)} required />
              <button type="submit" className="w-full bg-[#1877f2] text-white py-3 rounded-md text-xl font-bold hover:bg-[#166fe5]">Iniciar sesión</button>
              <hr className="my-2" />
              <div className="flex justify-center"><button type="button" className="bg-[#42b72a] text-white px-4 py-3 rounded-md font-bold text-[17px]">Crear una cuenta</button></div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && recentUser && recentUser.name && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl border relative overflow-hidden p-8 flex flex-col items-center">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-4 text-3xl text-gray-400 hover:text-black">&times;</button>
            <h3 className="text-xl font-semibold mb-6">Iniciar sesión como {recentUser.name.split(' ')[0]}</h3>
            <div className="w-40 h-40 rounded-lg overflow-hidden mb-6 border">
              {recentUser.photo ? <img src={recentUser.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-5xl">{recentUser.name?.[0]}</div>}
            </div>
            <form onSubmit={(e) => handleSubmit(e, recentUser.username)} className="w-full space-y-4">
              <input autoFocus type="password" placeholder="Contraseña" className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setPass(e.target.value)} required />
              <button type="submit" className="w-full bg-[#1877f2] text-white py-3 rounded-md font-bold text-lg hover:bg-[#166fe5]">Iniciar sesión</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}