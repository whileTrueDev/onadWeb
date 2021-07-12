/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface MarketerSignupMutationDto {
  marketerId: string;
  marketerRawPasswd: string;
  marketerName: string;
  marketerMail: string;
  marketerPhoneNum: string;
  platformType?: number;
}
type MarketerSignupMutationRes = {
  error: null | boolean;
  result?: string;
};

export const useMarketerSignupMutation = () => {
  return useMutation((dto: MarketerSignupMutationDto) =>
    axios.post<MarketerSignupMutationRes>('/marketer', dto),
  );
};
