import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorDeleteLinkAfreecaCertMutationDto {
  afreecaId: string;
}

export const useCreatorDeleteLinkAfreecaCertMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorDeleteLinkAfreecaCertMutationDto) =>
      axios.delete<boolean>('/link/afreeca/cert', { data: dto }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorProfile');
        queryClient.invalidateQueries('creatorLinkAfreecaCert');
      },
    },
  );
};
