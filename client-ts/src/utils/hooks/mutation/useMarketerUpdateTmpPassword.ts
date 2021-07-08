import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerUpdateTmpPasswordDto {
  marketerName: string;
  marketerMail: string;
  marketerId: string;
}
type LogoutMutationRes = {
  error: boolean;
  message?: string;
  mailId?: string;
};

export const useMarketerUpdateTmpPassword = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateTmpPasswordDto) =>
      axios.patch<LogoutMutationRes>('/marketer/tmp-password', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerProfile');
        queryClient.invalidateQueries('marketerProfileSocial');
      },
    },
  );
};
