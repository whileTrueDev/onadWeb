import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorBannerStartCheck = async () => {
  const res = await axios.get<string>('/creator/banner/start-check');
  return res.data;
};

export const useCreatorBannerStartCheck = () => {
  return useQuery('creatorBannerStartCheck', getCreatorBannerStartCheck, {
    // staleTime 15일
    staleTime: 1000 * 60 * 60 * 24 * 15,
  });
};
