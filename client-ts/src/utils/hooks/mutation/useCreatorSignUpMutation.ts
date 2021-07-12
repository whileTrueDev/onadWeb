/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CreatorSignUpMutationDto {
  userid: string;
  passwd: string;
  referralCode?: string | null;
}
type CreatorSignUpMutationRes = string;

export const useCreatorSignUpMutation = () => {
  return useMutation((dto: CreatorSignUpMutationDto) =>
    axios.post<CreatorSignUpMutationRes>('/creator', dto),
  );
};
