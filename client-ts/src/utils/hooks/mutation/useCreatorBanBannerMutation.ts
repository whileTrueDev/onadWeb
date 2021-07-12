import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorBanBannerDto {
  campaignId: string;
}

export const useCreatorBanBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorBanBannerDto) =>
      axios.delete<boolean>('/creator/banner', {
        data: dto,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorBannerList');
        queryClient.invalidateQueries('creatorBannerActive');
      },
    },
  );
};
