import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerActionLog {
  id: number;
  marketerId: string;
  type: number;
  detail: string;
  date: Date;
}

const getMarketerActionLog = async () => {
  return axios.get<MarketerActionLog[]>('/marketer/history').then(res => res.data);
};

export const useMarketerActionLog = () => {
  return useQuery('marketerActionLog', getMarketerActionLog, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
