import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerCreateCashChargeMutationDto = {
  chargeCash: string | number;
  chargeType: string | number;
};
type MarketerCreateCashChargeMutationRes = [boolean];

export const useMarketerCreateCashChargeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerCreateCashChargeMutationDto) =>
      axios.post<MarketerCreateCashChargeMutationRes>('/marketer/cash/charge', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCash');
        queryClient.invalidateQueries('marketerCashChargeHistory');
      },
    },
  );
};
