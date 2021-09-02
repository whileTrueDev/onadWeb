import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useUpdateNoticeReadFlagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.patch<boolean>('/notice/read-flag'), {
    onSuccess: () => {
      queryClient.invalidateQueries('noticeReadFlag');
    },
  });
};
