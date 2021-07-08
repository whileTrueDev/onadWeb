/* eslint-disable camelcase */
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerCreateCashChargeCardMutationDto = {
  chargeCash: string;
  chargeType: string;
  imp_uid: string;
  merchant_uid: string;
};
type MarketerCreateCashChargeMutationRes = {
  status: 'vbankIssued' | 'success';
  chargedCashAmount?: number | string;
  message?: string;
  vbank_num?: string;
  vbank_date?: string;
  vbank_name?: string;
  vbank_holder?: string;
};

export const useMarketerCreateCashChargeCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerCreateCashChargeCardMutationDto) =>
      axios.post<MarketerCreateCashChargeMutationRes>('/marketer/cash/charge/card', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerCash');
        queryClient.invalidateQueries('marketerCashChargeHistory');
      },
    },
  );
};
