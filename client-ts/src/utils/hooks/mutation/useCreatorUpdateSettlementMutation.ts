import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorUpdateSettlementMutationDto {
  bankName: string;
  bankRealName: string;
  bankAccount?: string;
  CreatorName: string;
  CreatorIdentity?: string | number;
  CreatorPhone?: string | number;
  CreatorIDImg: string | ArrayBuffer | null;
  CreatorAccountImg: string | ArrayBuffer | null;
  CreatorBussinessImg: string | ArrayBuffer | null;
  CreatorType: number;
}

export const useCreatorUpdateSettlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorUpdateSettlementMutationDto) => axios.patch<boolean>('/creator/settlement', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorProfile');
      },
    },
  );
};
