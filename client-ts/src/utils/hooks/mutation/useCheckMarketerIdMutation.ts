/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CheckMarketerIdMutationDto {
  idValue: string;
}
type CheckMarketerIdMutationRes = boolean;

export const useCheckMarketerIdMutation = () => {
  return useMutation((dto: CheckMarketerIdMutationDto) =>
    axios.post<CheckMarketerIdMutationRes>('/marketer/checkId', dto),
  );
};
