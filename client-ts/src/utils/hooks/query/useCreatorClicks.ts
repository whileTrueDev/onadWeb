import { useQuery } from 'react-query';
import axios from '../../axios';

export interface ClicksRes {
  adpanel: number;
  adchat: number;
}

const getCreatorClicks = async () => {
  const res = await axios.get<ClicksRes>('/creator/clicks');
  return res.data;
};

export const useCreatorClicks = () => {
  return useQuery('creatorClicks', getCreatorClicks, {
    staleTime: 1000 * 60 * 5, // 5분
  });
};
