import { useQuery } from 'react-query';
import axios from '../../axios';

export interface NoticeData {
  id: string;
  code: string;
  topic: string;
  headerName: string;
  regiDate: string;
  title: string;
  contents?: string;
  target: string;
}

const getNoticeList = async () => {
  const res = await axios.get<NoticeData[]>('/notice');
  return res.data;
};

export const useNoticeList = () => {
  return useQuery('noticeList', getNoticeList, {
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
};
