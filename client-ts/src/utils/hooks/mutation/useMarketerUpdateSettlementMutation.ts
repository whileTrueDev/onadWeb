import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerUpdateSettlementMutationDto = {
  businessmanFlag: boolean;
  name?: string;
  identificationNumber?: string;
  bankName?: string;
  bankAccountOwner?: string;
  bankAccountNumber?: string;
  identificationImgSrc?: string;
  bankAccountImgSrc?: string;
};

export const useMarketerUpdateSettlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateSettlementMutationDto) => axios.patch<number>('/marketer/settlement', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerSettlement');
      },
    },
  );
};
