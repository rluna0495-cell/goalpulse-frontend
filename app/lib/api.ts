import axios from 'axios';

// Definimos la URL base. Priorizamos la variable de entorno, 
// pero mantenemos la de producción como respaldo.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const footballApi = {
  getLive: (date?: string) => api.get('/football/live', { params: { date } }),
  getToday: (date?: string) => api.get('/football/today', { params: { date } }),
  getStandings: (league: number, season: number) =>
    api.get('/football/standings', { params: { league, season } }),
  getMatch: (id: number) => api.get(`/football/match/${id}`),
  getMatchStats: (id: number) => api.get(`/football/match/${id}/statistics`),
  getLeagues: () => api.get('/football/leagues'),
  getCountries: () => api.get('/football/countries'),
};