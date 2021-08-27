import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerCampaignOnOffMutationDto = {
  onoffState: boolean;
  campaignId: string;
};
type MarketerCampaignOnOffMutationRes = [boolean, string?];

export const useMarketerCampaignOnOffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerCampaignOnOffMutationDto) =>
      axios.patch<MarketerCampaignOnOffMutationRes>('/marketer/campaign/on-off', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCampaignList');
        queryClient.invalidateQueries('marketerCampaign');
        queryClient.invalidateQueries('marketerCampaignActive');
      },
    },
  );
};
