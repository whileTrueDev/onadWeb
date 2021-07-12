import { useMutation } from 'react-query';
import axios from '../../axios';

interface CheckCreatorPasswordMutationDto {
  password: string;
}

type CheckCreatorPasswordMutationRes = boolean;

export const useCreatorCheckPasswordMutation = () => {
  return useMutation((dto: CheckCreatorPasswordMutationDto) =>
    axios.post<CheckCreatorPasswordMutationRes>('/creator/password', dto),
  );
};
