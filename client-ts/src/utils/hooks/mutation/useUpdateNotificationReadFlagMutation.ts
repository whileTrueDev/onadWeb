import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface UpdateNotificationReadFlagMutationDto {
  index: number;
}
type CreatorOrMarketerParam = 'marketer' | 'creator';

export const useUpdateNotificationReadFlagMutation = (userType: CreatorOrMarketerParam) => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: UpdateNotificationReadFlagMutationDto) =>
      axios.patch<boolean>(`/${userType}/notification`, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    },
  );
};
