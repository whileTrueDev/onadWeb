import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerCreateCashRefundMutationDto = {
  withdrawCash: string;
};
type MarketerCreateCashRefundMutationRes = [boolean];

export const useMarketerCreateCashRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerCreateCashRefundMutationDto) =>
      axios.post<MarketerCreateCashRefundMutationRes>('/marketer/cash/refund', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCashRefundHistory');
        queryClient.invalidateQueries('marketerCash');
      },
    },
  );
};
