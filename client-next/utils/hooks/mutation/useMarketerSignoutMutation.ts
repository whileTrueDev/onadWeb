import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useMarketerSignoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.delete<boolean>('/marketer'), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
