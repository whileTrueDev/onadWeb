import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CreateInquiryMutationDto {
  name: string;
  email: string;
  contactNumber: string;
  brandName: string;
  homepage: string;
  inquiryContents: string;
  privacyAgreement: boolean;
}
type LogoutMutationRes = boolean;

export const useCreateInquiryMutation = () => {
  return useMutation((dto: CreateInquiryMutationDto) =>
    axios.post<LogoutMutationRes>('/inquiry', dto),
  );
};
