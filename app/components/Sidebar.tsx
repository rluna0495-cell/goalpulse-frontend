'use client';
import { useState, useEffect } from 'react';
import { footballApi } from '@/app/lib/api';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const { t } = useApp();

  useEffect(() => {
    // Aquí traeremos la lista de países y ligas
    const loadLeagues = async () => {
      try {
        const res = await footballApi.getLeagues();
        // Agrupamos por país para que se vea ordenado
        setCountries(res.data.data || []);
      } catch (e) { console.error("Error cargando ligas", e); }
    };
    loadLeagues();
  }, []);

  const filteredCountries = countries.filter(c => 
    c.country.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50); // Limitamos para no saturar la vista

  return (
    <aside className="w-64 bg-[#1a2235] h-screen overflow-y-auto p-4 border-r border-gray-800 hidden md:block">
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Buscar país o liga..." 
          className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#00ff87] outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('Principales')}</h3>
        <ul className="space-y-2">
          {['Champions League', 'Europa League', 'Premier League', 'La Liga', 'Serie A'].map(top => (
            <li key={top} className="text-sm hover:text-[#00ff87] cursor-pointer flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00ff87] rounded-full"></span> {top}
            </li>
          ))}
        </ul>

        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-6">{t('Países')}</h3>
        <ul className="space-y-2">
          {filteredCountries.map((item: any) => (
            <li key={item.league.id} className="text-sm py-1 hover:bg-[#252f4a] px-2 rounded cursor-pointer flex items-center gap-2">
              <img src={item.country.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
              <span className="truncate">{item.country.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}