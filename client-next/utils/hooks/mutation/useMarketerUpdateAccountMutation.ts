/* eslint-disable camelcase */
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerUpdateAccountMutationDto = {
  bankName: string;
  bankRealName: string;
  idNumber: string;
  bankAccount: string;
};
type MarketerUpdateAccountMutationRes = boolean;

export const useMarketerUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateAccountMutationDto) =>
      axios.put<MarketerUpdateAccountMutationRes>('/marketer/account', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerProfile');
        queryClient.invalidateQueries('marketerAccount');
      },
    },
  );
};
