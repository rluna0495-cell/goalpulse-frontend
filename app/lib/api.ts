import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/football';

export const footballApi = {
  getLive: () => axios.get(`${BASE_URL}/live`),
  getToday: () => axios.get(`${BASE_URL}/today`),
  getMatchDetails: (id: string) => axios.get(`${BASE_URL}/match/${id}`),
  getMatchesByLeague: (leagueId: number) => axios.get(`${BASE_URL}/league/${leagueId}`),
  getStandings: (leagueId: number) => axios.get(`${BASE_URL}/standings/${leagueId}`),
};