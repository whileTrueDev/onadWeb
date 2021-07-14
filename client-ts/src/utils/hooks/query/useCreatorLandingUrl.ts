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
    staleTime: 1000 * 60 * 60 * 1, // 1시간 이후 만료로 표시
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
