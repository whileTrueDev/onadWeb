import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorUpdatePasswordMutationDto {
  password: string;
}

export const useCreatorUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorUpdatePasswordMutationDto) => axios.patch<number>('/creator/password', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorProfile');
      },
    },
  );
};
