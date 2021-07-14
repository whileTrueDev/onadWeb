import { useMutation } from 'react-query';
import axios from '../../axios';

export interface CreateCreatorInquiryMutationDto {
  name: string;
  email: string;
  contactNumber: string;
  brandName: string;
  homepage: string;
  inquiryContents: string;
  privacyAgreement: boolean;
}
type LogoutMutationRes = boolean;

export const useCreateCreatorInquiryMutation = () => {
  return useMutation((dto: CreateCreatorInquiryMutationDto) =>
    axios.post<LogoutMutationRes>('/inquiry/creator', dto),
  );
};
