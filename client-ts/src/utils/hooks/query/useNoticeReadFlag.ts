import { useQuery } from 'react-query';
import axios from '../../axios';

export type CreatorOrMarketerParams = 'creator' | 'marketer';

export interface NoticeReadFlag {
  noticeReadState: number;
}

const getNoticeReadFlag = async (userType: CreatorOrMarketerParams) => {
  return axios
    .get<NoticeReadFlag>(`/notice/read-flag`, { params: { userType } })
    .then(res => res.data);
};

export const useNoticeReadFlag = (userType: CreatorOrMarketerParams) => {
  return useQuery(['noticeReadFlag', userType], () => getNoticeReadFlag(userType), {
    enabled: !!userType,
  });
};
