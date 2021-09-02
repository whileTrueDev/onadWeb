/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface MarketerSignupWithPlatformMutationDto {
  marketerId: string;
  marketerRawPasswd: string;
  marketerName: string;
  marketerMail: string;
  marketerPhoneNum: string;
  platformType?: number;
}
type MarketerSignupWithPlatformMutationRes = {
  error: null | boolean;
  result?: string;
};

export const useMarketerSignupWithPlatformMutation = () => {
  return useMutation((dto: MarketerSignupWithPlatformMutationDto) =>
    axios.post<MarketerSignupWithPlatformMutationRes>('/marketer/platform', dto),
  );
};
