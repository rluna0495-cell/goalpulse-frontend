export const favoritesManager = {
  toggleFavorite: (id: number, type: 'team' | 'league') => {
    const favs = JSON.parse(localStorage.getItem('goalpulse_favs') || '{"teams":[], "leagues":[]}');
    const list = favs[type === 'team' ? 'teams' : 'leagues'];
    
    const index = list.indexOf(id);
    if (index > -1) list.splice(index, 1);
    else list.push(id);
    
    localStorage.setItem('goalpulse_favs', JSON.stringify(favs));
    return list.includes(id);
  },
  
  isFavorite: (id: number, type: 'team' | 'league') => {
    if (typeof window === 'undefined') return false;
    const favs = JSON.parse(localStorage.getItem('goalpulse_favs') || '{"teams":[], "leagues":[]}');
    return favs[type === 'team' ? 'teams' : 'leagues'].includes(id);
  }
};