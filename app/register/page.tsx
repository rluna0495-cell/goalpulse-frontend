'use client';
import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', lang: 'es' });

  const handleRegister = (e: any) => {
    e.preventDefault();
    console.log("Registrando usuario...", form);
    alert("¡Registro exitoso! (Simulado)");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-[#1a2235] p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h2 className="text-[#00ff87] text-2xl font-bold mb-6">Únete a GoalPulse</h2>
        <input 
          type="text" placeholder="Nombre" 
          className="w-full p-3 mb-4 bg-[#0a0e1a] border border-gray-700 rounded text-white"
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <input 
          type="email" placeholder="Correo electrónico" 
          className="w-full p-3 mb-4 bg-[#0a0e1a] border border-gray-700 rounded text-white"
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <select 
          className="w-full p-3 mb-6 bg-[#0a0e1a] border border-gray-700 rounded text-white"
          onChange={(e) => setForm({...form, lang: e.target.value})}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
        <button className="w-full bg-[#00ff87] text-black font-bold p-3 rounded-lg hover:bg-green-400 transition">
          CREAR CUENTA
        </button>
      </form>
    </div>
  );
}