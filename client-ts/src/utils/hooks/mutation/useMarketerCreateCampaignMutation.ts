import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerCreateCampaignMutationDto {
  optionType: string;
  priorityType: string;
  campaignName: string;
  campaignDescription: string;
  dailyLimit: string | number;
  bannerId: string;
  connectedLinkId: string | null;
  merchandiseId: string | null;
  priorityList: string[];
  selectedTime: number[];
  startDate: string | Date;
  finDate: string | Date | null;
  keyword: string[];
}

type MarketerCreateCampaignMutationRes = [boolean, string];

export const useMarketerCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerCreateCampaignMutationDto) =>
      axios.post<MarketerCreateCampaignMutationRes>('/marketer/campaign', dto),
    {
      onSuccess() {
        queryClient.invalidateQueries('marketerCampaignLength');
        queryClient.invalidateQueries('marketerCampaignList');
        queryClient.invalidateQueries('marketerCampaignActive');
        queryClient.invalidateQueries('marketerCampaignNames');
      },
    },
  );
};
