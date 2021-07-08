import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerUpdateMarketerInfoMutationDto = {
  type: 'name' | 'password' | 'mail' | 'phone' | 'profileImage';
  value: string | number;
};

export const useMarketerUpdateMarketerInfoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateMarketerInfoMutationDto) => axios.patch<boolean>('/marketer', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerProfile');
        queryClient.invalidateQueries('marketerProfileSocial');
      },
    },
  );
};
