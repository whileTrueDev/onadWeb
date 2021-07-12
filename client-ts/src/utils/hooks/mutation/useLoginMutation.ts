import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';
import { MarketerInfo } from '../query/useMarketerProfile';

type CreatorOrMarketerParam = 'creator' | 'marketer';
export interface LoginMutationDto {
  type: CreatorOrMarketerParam;
  userid: string;
  passwd: string;
}
type LoginMutationRes = [boolean, string | MarketerInfo] | string;

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: LoginMutationDto) => {
      return axios.post<LoginMutationRes>('/login', dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorProfile');
        queryClient.invalidateQueries('marketerProfile');
        queryClient.invalidateQueries('marketerProfileSocial');
      },
    },
  );
};
