import axios from 'axios';

const api = axios.create({
  baseURL: 'https://goalpulse-backend-production.up.railway.app/api',
});

export const footballApi = {
  getLive: () => api.get('/football/live'),
  getToday: () => api.get('/football/today'),
  getStandings: (league: number, season: number) =>
    api.get('/football/standings', { params: { league, season } }),
  getMatch: (id: number) => api.get(`/football/match/${id}`),
};