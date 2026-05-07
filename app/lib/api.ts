import axios from 'axios';

// URL directa de tu Railway para que no falle la conexión
const BASE_URL = 'https://goalpulse-backend-production.up.railway.app/api/football';

export const footballApi = {
  getLive: () => axios.get(`${BASE_URL}/live`),
  getToday: () => axios.get(`${BASE_URL}/today`),
  getMatchDetails: (id: string) => axios.get(`${BASE_URL}/match/${id}`),
  getMatchLineups: (id: string) => axios.get(`${BASE_URL}/match/${id}/lineups`),
  getMatchStats: (id: string) => axios.get(`${BASE_URL}/match/${id}/stats`),
  getMatchesByLeague: (id: number) => axios.get(`${BASE_URL}/league/${id}`),
  getStandings: (id: number) => axios.get(`${BASE_URL}/standings/${id}`),
};