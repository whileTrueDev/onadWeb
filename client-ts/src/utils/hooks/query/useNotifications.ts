import { useQuery } from 'react-query';
import axios from '../../axios';

export type CreatorOrMarketerParams = 'creator' | 'marketer';

export interface Notification {
  index: number;
  title: string;
  content: string;
  dateform: string;
  readState: number;
}

export interface NotificationRes {
  notifications: Notification[];
  unReadCount: number;
}

const getNotifications = async (type: CreatorOrMarketerParams) => {
  return axios.get<NotificationRes>(`${type}/notification`).then(res => res.data);
};

export const useNotifications = (type: CreatorOrMarketerParams) => {
  return useQuery(['notifications', type], () => getNotifications(type), {
    enabled: !!type,
    staleTime: 1000 * 60 * 1,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
