import { useQuery } from 'react-query';
import axios from '../../axios';

export interface AfreecaCategory {
  categoryId: string;
  categoryNameKr: string;
  isSub: boolean;
  parentCategoryId: string;
}
const getGames = async () => {
  return axios.get<AfreecaCategory[]>('/games').then(res => res.data);
};

export const useGames = () => {
  return useQuery('games', getGames, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
