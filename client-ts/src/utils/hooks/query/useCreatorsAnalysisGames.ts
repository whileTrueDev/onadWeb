import { useQuery } from 'react-query';
import axios from '../../axios';

interface CreatorsAnalysisGame {
  count: number;
  content: string;
  gameId: string;
  gameName: string;
  gameNameKr: string;
  boxArt: string;
}

const getCreatorsAnalysisGames = async () => {
  const res = await axios.get<CreatorsAnalysisGame[]>('/creators/analysis/games');
  return res.data;
};

export const useCreatorsAnalysisGames = () => {
  return useQuery('creatorsAnalysisGames', getCreatorsAnalysisGames, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
  });
};
