import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type MarketerAdOnOffMutationDto = {
  onOffState: boolean;
};
type MarketerAdOnOffMutationRes = [boolean, string?];

export const useMarketerAdOnOffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerAdOnOffMutationDto) =>
      axios.post<MarketerAdOnOffMutationRes>('/marketer/ad/on-off', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerAdOnOff');
      },
    },
  );
};
