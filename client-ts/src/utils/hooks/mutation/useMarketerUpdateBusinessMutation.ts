import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';
import { UploadImage } from '../useBannerUpload';

export interface MarketerUpdateBusinessMutationDto {
  value: string | UploadImage;
}
export const useMarketerUpdateBusinessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateBusinessMutationDto) => axios.put<boolean>('/marketer/business', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerBusiness');
      },
    },
  );
};
