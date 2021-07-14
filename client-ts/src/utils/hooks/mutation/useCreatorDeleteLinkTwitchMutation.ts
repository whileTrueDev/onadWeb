import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useCreatorDeleteLinkTwitchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.delete<boolean>('/link/twitch'), {
    onSuccess: () => {
      queryClient.invalidateQueries('creatorProfile');
    },
  });
};
