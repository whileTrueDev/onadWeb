import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

type LogoutMutationRes = void;

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.post<LogoutMutationRes>('/logout'), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
