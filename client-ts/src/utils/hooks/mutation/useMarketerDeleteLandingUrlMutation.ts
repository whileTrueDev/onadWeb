import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerDeleteLandingUrlMutationDto {
  linkId: string;
}
export const useMarketerDeleteLandingUrlMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerDeleteLandingUrlMutationDto) =>
      axios.delete<boolean>('/marketer/landing-url', { data: dto }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerLandingUrlList');
        queryClient.invalidateQueries('marketerLandingUrlLength');
        queryClient.invalidateQueries('marketerLandingUrlListWithoutPagination');
        queryClient.invalidateQueries('marketerLandingUrlConnectedCampaigns');
      },
    },
  );
};
