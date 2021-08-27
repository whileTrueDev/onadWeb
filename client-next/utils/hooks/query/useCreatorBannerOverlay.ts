import { useQuery } from 'react-query';
import axios from '../../axios';

export interface OverlayUrlRes {
  advertiseUrl: string;
  creatorContractionAgreement: number;
}

const getCreatorBannerOverlay = async () => {
  const res = await axios.get<OverlayUrlRes>('/creator/banner/overlay');
  return res.data;
};

export const useCreatorBannerOverlay = () => {
  return useQuery('creatorBannerOverlay', getCreatorBannerOverlay, {
    staleTime: 1000 * 60 * 60 * 12, // staleTime 12시간
    cacheTime: 1000 * 60 * 60 * 24, // (배너오버레이는 바뀔일 크게 없다. 15일이라해도, 인메모리 캐시에 저장되므로 새로고침만 해도 다시 불러온다.)
  });
};
