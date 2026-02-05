import React, { useState } from 'react';

export default function LoginForm() {
  const [user, setUser] = useState<string>('');
  const [pass, setPass] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login.php", {
        method: "POST",
        body: JSON.stringify({ user, pass }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("user_session", JSON.stringify(data.user));
        window.location.href = "/feed";
      } else {  
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Red Social Vecinal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Usuario (admin o usuario)" 
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}