import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorUpdateAdchatAgreementMutationDto {
  targetOnOffState: boolean;
}
export const useCreatorUpdateAdchatAgreementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorUpdateAdchatAgreementMutationDto) =>
      axios.patch<boolean>('/creator/adchat/agreement', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorAdchatAgreement');
      },
    },
  );
};
