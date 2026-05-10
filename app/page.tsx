'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// --- CONFIGURACIÓN DE CONEXIÓN ---
const API_URL = 'https://goalpulse-backend-production.up.railway.app/api/football';
const SOCKET_URL = 'https://goalpulse-backend-production.up.railway.app';

export default function GoalPulseMaster() {
  // 1. ESTADOS DE LA APLICACIÓN
  const [activeTab, setActiveTab] = useState<'live' | 'today' | 'favorites'>('live');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // 2. GESTIÓN DE FAVORITOS
  useEffect(() => {
    const saved = localStorage.getItem('gp_favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('gp_favs', JSON.stringify(updated));
  };

  // 3. OBTENCIÓN DE DATOS (MUNDIAL)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'favorites' ? 'today' : activeTab;
      const res = await axios.get(`${API_URL}/${endpoint}`);
      let matches = res.data?.data || [];
      if (activeTab === 'favorites') {
        matches = matches.filter((m: any) => favorites.includes(m.fixture.id));
      }
      setData(matches);
    } catch (err) {
      console.error("API Error");
    } finally {
      setLoading(false);
    }
  }, [activeTab, favorites]);

  // 4. WEBSOCKETS EN TIEMPO REAL
  useEffect(() => {
    fetchData();
    const socket = io(SOCKET_URL);
    socket.on('match_update', (update) => {
      setData(prev => prev.map(m => m.fixture.id === update.id ? { ...m, ...update } : m));
    });
    return () => { socket.disconnect(); };
  }, [fetchData]);

  // 5. AGRUPACIÓN POR LIGAS (Lógica de Escritorio)
  const groupedMatches = useMemo(() => {
    return data.reduce((acc: any, m: any) => {
      const key = `${m.league.country}: ${m.league.name}`;
      if (!acc[key]) acc[key] = { logo: m.league.logo, matches: [] };
      acc[key].matches.push(m);
      return acc;
    }, {});
  }, [data]);

  return (
    <div className="flex h-screen w-full bg-[#05070a] text-white overflow-hidden font-sans">
      
      {/* COLUMNA 1: SIDEBAR (ANCHO FIJO) */}
      <aside className="w-[280px] border-r border-white/5 bg-[#0a0c14] flex flex-col shrink-0">
        <div className="p-10 text-[#00ff87] font-black text-2xl italic tracking-tighter">GOALPULSE</div>
        <nav className="flex-1 px-6 space-y-6 overflow-y-auto">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest px-4">Cobertura</p>
          {['UEFA', 'CONMEBOL', 'CONCACAF', 'AFC'].map(f => (
            <div key={f} className="p-3 px-4 rounded-xl text-xs font-bold text-gray-400 hover:bg-[#00ff87]/5 hover:text-[#00ff87] cursor-pointer transition-all uppercase">{f}</div>
          ))}
        </nav>
      </aside>

      {/* COLUMNA 2: FEED DE RESULTADOS (CENTRO) */}
      <main className="flex-1 flex flex-col bg-[#05070a]">
        <header className="h-20 px-10 border-b border-white/5 flex items-center justify-between bg-[#0a0c14]/40 backdrop-blur-xl">
          <div className="flex gap-1 bg-black p-1 rounded-2xl border border-white/10 shadow-2xl">
            {['live', 'today', 'favorites'].map(t => (
              <button key={t} onClick={() => { setActiveTab(t as any); setSelectedMatch(null); }}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  activeTab === t ? 'bg-[#00ff87] text-black shadow-lg shadow-[#00ff87]/30' : 'text-gray-500 hover:text-white'
                }`}>
                {t === 'live' ? 'En Vivo' : t === 'today' ? 'Hoy' : 'Favoritos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest tracking-widest">Global Stream</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/5 rounded-[35px]" />)}
            </div>
          ) : Object.entries(groupedMatches).map(([key, group]: any) => (
            <section key={key} className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 opacity-50">
                <img src={group.logo} className="w-4 h-4 object-contain grayscale" alt="" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">{key}</h3>
              </div>
              {group.matches.map((m: any) => (
                <div key={m.fixture.id} onClick={() => setSelectedMatch(m)}
                  className={`flex items-center px-8 py-6 rounded-[35px] border transition-all cursor-pointer ${
                    selectedMatch?.fixture?.id === m.fixture.id ? 'border-[#00ff87]/40 bg-[#00ff87]/5 shadow-2xl' : 'border-white/5 bg-[#0f111a] hover:border-white/10'
                  }`}>
                  <div className="w-14 text-xs font-black text-[#00ff87] italic">{m.fixture.status.elapsed}'</div>
                  <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-8">
                    <div className="flex items-center justify-end gap-5">
                      <span className="text-sm font-bold text-gray-300">{m.teams.home.name}</span>
                      <div className="w-9 h-9 flex items-center justify-center bg-black/40 rounded-full p-2 border border-white/5 shadow-inner">
                        <img src={m.teams.home.logo} className="max-w-full max-h-full object-contain" alt="" />
                      </div>
                    </div>
                    <div className="bg-black/60 px-6 py-2.5 rounded-2xl border border-white/10 text-2xl font-black italic text-white shadow-xl">
                      {m.goals.home} - {m.goals.away}
                    </div>
                    <div className="flex items-center justify-start gap-5">
                      <div className="w-9 h-9 flex items-center justify-center bg-black/40 rounded-full p-2 border border-white/5 shadow-inner">
                        <img src={m.teams.away.logo} className="max-w-full max-h-full object-contain" alt="" />
                      </div>
                      <span className="text-sm font-bold text-gray-300">{m.teams.away.name}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(m.fixture.id); }} className="ml-8 text-xl">
                    {favorites.includes(m.fixture.id) ? '⭐' : <span className="opacity-10 hover:opacity-100">☆</span>}
                  </button>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>

      {/* COLUMNA 3: DETALLE (ANCHO FIJO) */}
      <aside className="w-[400px] border-l border-white/5 bg-[#0a0c14] p-10 overflow-y-auto shrink-0 shadow-2xl">
        {!selectedMatch ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-4">
             <div className="text-8xl font-thin italic">⟁</div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Analytics Panel</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-8">
              <span className="text-[10px] text-[#00ff87] font-black uppercase tracking-widest block">Live Match Summary</span>
              <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/5 backdrop-blur-xl">
                 <div className="flex justify-between items-center gap-4 mb-6">
                    <div className="flex-1 text-center">
                       <img src={selectedMatch.teams.home.logo} className="w-12 h-12 mx-auto mb-3 object-contain" alt="" />
                       <div className="text-[10px] font-black uppercase text-gray-400 truncate">{selectedMatch.teams.home.name}</div>
                    </div>
                    <div className="text-5xl font-black italic text-white tracking-tighter tabular-nums">
                       {selectedMatch.goals.home}:{selectedMatch.goals.away}
                    </div>
                    <div className="flex-1 text-center">
                       <img src={selectedMatch.teams.away.logo} className="w-12 h-12 mx-auto mb-3 object-contain" alt="" />
                       <div className="text-[10px] font-black uppercase text-gray-400 truncate">{selectedMatch.teams.away.name}</div>
                    </div>
                 </div>
                 <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{selectedMatch.fixture.status.long}</div>
              </div>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[35px] border border-white/5 space-y-6">
              <div className="flex justify-between items-end mb-4 font-black uppercase text-gray-500 tracking-widest text-[10px]">
                 <span>Presión de campo</span>
                 <span className="text-[#00ff87] animate-pulse">LIVE</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden flex">
                 <div className="bg-[#00ff87] shadow-[0_0_10px_#00ff87]" style={{ width: '60%' }} />
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase italic">
                 <span>Home 60%</span>
                 <span>Away 40%</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}