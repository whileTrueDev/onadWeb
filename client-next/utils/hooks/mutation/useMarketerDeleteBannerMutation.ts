import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerDeleteBannerMutationDto {
  bannerId: string;
}
export const useMarketerDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerDeleteBannerMutationDto) =>
      axios.delete<boolean>('/marketer/banner', { data: dto }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerBannerLength');
        queryClient.invalidateQueries('marketerBannerList');
        queryClient.invalidateQueries('marketerBannerListActive');
        queryClient.invalidateQueries('marketerBannerConnectedCampaigns');
      },
    },
  );
};
