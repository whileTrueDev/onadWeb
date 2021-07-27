import { useQuery } from 'react-query';
import axios from '../../axios';

export interface ContractedCreatorListData {
  creatorId: string;
  creatorName: string;
  creatorLogo: string;
  followers: number;
  content: string;
  openHour: string;
  creatorTwitchId: string;
}

const getCreators = async () => {
  return axios.get<ContractedCreatorListData[]>('/creators').then(res => res.data);
};

export const useCreators = () => {
  return useQuery('creators', getCreators, {
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60 * 1,
  });
};
