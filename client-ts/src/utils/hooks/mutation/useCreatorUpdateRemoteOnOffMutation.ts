import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type CreatorUpdateRemoteOnOffMutationDto = {
  campaignId: string;
  state: number;
  url: string;
};

export const useCreatorUpdateRemoteOnOffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorUpdateRemoteOnOffMutationDto) =>
      axios.patch<boolean>('/creator/remote/onoff', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorRemoteCampaigns');
      },
    },
  );
};
