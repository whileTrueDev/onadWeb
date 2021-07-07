import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreateLandingUrlDto {
  links: {
    primary: boolean;
    linkName: string;
    linkTo: string;
  }[];
}

export const useMarketerCreateLandingUrlMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreateLandingUrlDto) => axios.post<any[]>('/marketer/landing-url', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerLandingUrlListWithoutPagination');
        queryClient.invalidateQueries('marketerLandingUrlList');
        queryClient.invalidateQueries('marketerLandingUrlListWithoutPagination');
        queryClient.invalidateQueries('marketerLandingUrlConnectedCampaigns');
      },
    },
  );
};
