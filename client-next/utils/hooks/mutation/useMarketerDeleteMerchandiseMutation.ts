import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface MarketerDeleteMerchandiseMutationDto {
  id: number;
}
export const useMarketerDeleteMerchandiseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerDeleteMerchandiseMutationDto) =>
      axios.delete<boolean>('/marketer/merchandises', { data: dto }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerMerchandisesList');
      },
    },
  );
};
