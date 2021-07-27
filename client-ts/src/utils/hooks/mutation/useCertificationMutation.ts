/* eslint-disable camelcase */
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CertificationMutationDto {
  imp_uid: string;
}
type CertificationMutationRes = {
  error: boolean;
  data: {
    minor?: boolean;
    msg?: string;
  };
};

export const useCertificationMutation = () => {
  return useMutation((dto: CertificationMutationDto) =>
    axios.post<CertificationMutationRes>('/certification', dto),
  );
};
