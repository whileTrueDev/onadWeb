import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useCreatorDeleteLinkAfreecaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.delete<boolean>('/link/afreeca'), {
    onSuccess: () => {
      queryClient.invalidateQueries('creatorProfile');
    },
  });
};
