import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

type CreateCreatorWithdrawalDTO = { withdrawalAmount: string | number };
type CreateCreatorWithdrawalRes = string;

export const useCreatorCreateWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreateCreatorWithdrawalDTO) =>
      axios.post<CreateCreatorWithdrawalRes>('/creator/income/withdrawal', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorIncomeWithdrawal');
        queryClient.invalidateQueries('creatorIncome');
        queryClient.invalidateQueries('creatorIncomeChart');
        queryClient.invalidateQueries('creatorIncomeRatio');
      },
    },
  );
};
