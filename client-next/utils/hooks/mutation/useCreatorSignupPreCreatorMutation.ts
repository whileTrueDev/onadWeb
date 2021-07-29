/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CreatorSignupPreCreatorMutationDto {
  userid: string;
  passwd: string;
  creatorId?: string;
  accessToken?: string;
}
type CreatorSignupPreCreatorMutationRes = string;

export const useCreatorSignupPreCreatorMutation = () => {
  return useMutation((dto: CreatorSignupPreCreatorMutationDto) =>
    axios.post<CreatorSignupPreCreatorMutationRes>('/creator/pre-user', dto),
  );
};
