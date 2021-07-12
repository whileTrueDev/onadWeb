import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerUpdateCampaignMutationDto {
  campaignId: string;
  type: string;
  data: {
    noBudget: boolean;
    budget: string;
    campaignName: string;
  };
}

export const useMarketerUpdateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateCampaignMutationDto) => axios.patch<boolean>(`/marketer/campaign`, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCampaignList');
        queryClient.invalidateQueries('marketerCampaign');
        queryClient.invalidateQueries('marketerCampaignActive');
        queryClient.invalidateQueries('marketerCampaignNames');
      },
    },
  );
};
