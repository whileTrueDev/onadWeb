import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface SettlementRegDTO {
  name: string;
  identificationNumber: string;
  bankName: string;
  bankAccountOwner: string;
  bankAccountNumber: string;
  businessmanFlag: boolean | string;
  identificationImgSrc: string;
  bankAccountImgSrc: string;
}

type MarketerCreateSettlementMutationRes = {
  id: number;
  marketerId: string | null;
  name: string | null;
  identificationNumber: string | null;
  bankAccountOwner: string | null;
  bankAccountNumber: string | null;
  state: boolean | null;
  businessmanFlag: boolean;
  identificationImgSrc: string | null;
  bankAccountImgSrc: string | null;
  createDate: Date;
  updateDate: Date;
};

export const useMarketerCreateSettlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: Partial<SettlementRegDTO>) =>
      axios.post<MarketerCreateSettlementMutationRes>('/marketer/settlement', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerSettlement');
      },
    },
  );
};
