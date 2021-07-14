import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreateBannerDto {
  bannerSrc?: string;
}

export const useMarketerCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreateBannerDto) => axios.post<[boolean, string]>('/marketer/banner', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerBannerListActive');
        queryClient.invalidateQueries('marketerBannerList');
        queryClient.invalidateQueries('marketerBannerLength');
        queryClient.invalidateQueries('marketerBannerConnectedCampaigns');
      },
    },
  );
};
