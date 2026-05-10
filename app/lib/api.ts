import axios from 'axios';

// La dirección de tu motor real en Railway
const API_URL = 'https://goalpulse-backend-production.up.railway.app/api/football';

export const footballApi = {
  getLive: () => axios.get(`${API_URL}/live`),
  getToday: () => axios.get(`${API_URL}/today`),
  getMatchDetails: (id: string) => axios.get(`${API_URL}/match/${id}`),
  getMatchLineups: (id: string) => axios.get(`${API_URL}/match/${id}/lineups`),
  getMatchStats: (id: string) => axios.get(`${API_URL}/match/${id}/stats`),
  getLeagues: () => axios.get(`${API_URL}/leagues`),
  getStandings: (id: number) => axios.get(`${API_URL}/standings/${id}`),
};