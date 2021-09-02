import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type CreatorUpdateContractionMutationDto = {
  type: 'contraction';
};

export const useCreatorUpdateContractionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorUpdateContractionMutationDto) => axios.patch<boolean>('/creator', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorLandingUrl');
        queryClient.invalidateQueries('creatorBannerOverlay');
        queryClient.invalidateQueries('creatorProfile');
      },
    },
  );
};
