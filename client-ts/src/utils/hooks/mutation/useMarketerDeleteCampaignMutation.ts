import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerDeleteCampaignMutationDto {
  campaignId: string;
}
export const useMarketerDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerDeleteCampaignMutationDto) =>
      axios.delete<boolean>('/marketer/campaign', { data: dto }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCampaignList');
        queryClient.invalidateQueries('marketerCampaignActive');
        queryClient.invalidateQueries('marketerCampaignNames');
        queryClient.invalidateQueries('marketerCampaignLength');
      },
    },
  );
};
