import { useQuery } from 'react-query';
import axios from '../../axios';

export type CreatorOrMarketerParams = 'creator' | 'marketer';

export interface NoticeReadFlag {
  noticeReadState: number;
}

const getNoticeReadFlag = async () => {
  return axios.get<NoticeReadFlag>(`/notice/read-flag`).then(res => res.data);
};

export const useNoticeReadFlag = () => {
  return useQuery('noticeReadFlag', getNoticeReadFlag);
};
