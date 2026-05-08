import axios from 'axios';

// 💡 Esta configuración permite que tu App funcione en tu PC y en la Nube
// Usamos la URL de Railway que me diste: goalpulse-backend-production.up.railway.app
const RAILWAY_URL = 'https://goalpulse-backend-production.up.railway.app/api/football';
const LOCAL_URL = 'http://localhost:3001/api/football';

// El sistema detecta automáticamente si estás en producción o en tu PC
const BASE_URL = process.env.NODE_ENV === 'production' ? RAILWAY_URL : LOCAL_URL;

export const footballApi = {
  // Partidos en Vivo y de Hoy
  getLive: () => axios.get(`${BASE_URL}/live`),
  getToday: () => axios.get(`${BASE_URL}/today`),
  
  // Detalles, Alineaciones y Estadísticas
  getMatchDetails: (id: string) => axios.get(`${BASE_URL}/match/${id}`),
  getMatchLineups: (id: string) => axios.get(`${BASE_URL}/match/${id}/lineups`),
  getMatchStats: (id: string) => axios.get(`${BASE_URL}/match/${id}/stats`),
  
  // Navegación de Ligas y Países
  getLeagues: () => axios.get(`${BASE_URL}/leagues`),
  
  // Tablas de Posiciones
  getStandings: (id: number) => axios.get(`${BASE_URL}/standings/${id}`),
};