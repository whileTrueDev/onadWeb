import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useCreatorSignoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.delete<boolean>('/creator'), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
