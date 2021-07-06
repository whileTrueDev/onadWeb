import { useQuery } from 'react-query';
import axiosInstance from '../../axios';

export type CreatorLandingUrlParams = 'twitch' | 'afreeca';

export interface CreatorLandingUrl {
  url: string;
}

const getCreatorLandingUrl = async (type: CreatorLandingUrlParams) => {
  const res = await axiosInstance.get<CreatorLandingUrl>('/creator/landing-url', {
    params: { type },
  });

  return res.data;
};

export const useCreatorLandingUrl = (type: CreatorLandingUrlParams) => {
  return useQuery(['creatorLandingUrl', type], () => getCreatorLandingUrl(type), {
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
