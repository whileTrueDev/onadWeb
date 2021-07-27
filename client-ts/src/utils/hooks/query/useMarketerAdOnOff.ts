import { useQuery } from 'react-query';
import axios from '../../axios';

export interface OnOffInterface {
  onOffState: boolean;
}

const getMarketerAdOnOff = async () => {
  return axios.get<OnOffInterface>('/marketer/ad/on-off').then(res => res.data);
};

export const useMarketerAdOnOff = () => {
  return useQuery('marketerAdOnOff', getMarketerAdOnOff, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 10,
  });
};
