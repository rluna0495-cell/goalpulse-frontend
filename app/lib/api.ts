import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const footballApi = {
  getLive: () => api.get('/football/live'),
  getToday: () => api.get('/football/today'),
  getStandings: (league: number, season: number) =>
    api.get('/football/standings', { params: { league, season } }),
  getMatch: (id: number) => api.get(`/football/match/${id}`),
};

export const tennisApi = {
  getLive: () => api.get('/tennis/live'),
  getToday: () => api.get('/tennis/today'),
  getTournaments: () => api.get('/tennis/tournaments'),
};

export const basketballApi = {
  getLive: () => api.get('/basketball/live'),
  getToday: () => api.get('/basketball/today'),
  getStandings: (league: number, season: string) =>
    api.get('/basketball/standings', { params: { league, season } }),
};

export const baseballApi = {
  getLive: () => api.get('/baseball/live'),
  getToday: () => api.get('/baseball/today'),
  getStandings: (league: number, season: string) =>
    api.get('/baseball/standings', { params: { league, season } }),
};