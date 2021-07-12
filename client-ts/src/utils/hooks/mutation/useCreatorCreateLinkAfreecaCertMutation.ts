import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface CreatorCreateLinkAfreecaCertMutationDto {
  afreecaId: string;
}

interface CreatorCreateLinkAfreecaCertMutationRes {
  status: 'already-linked' | 'duplicate-request' | 'created';
  user?: {
    creatorId: string;
    loginId: string;
  };
  cert?: {
    id: number;
    creatorId: string | null;
    tempCode: string | null;
    certState: number | null;
    afreecaId: string | null;
    createdAt: Date | null;
  };
}

export const useCreatorCreateLinkAfreecaCertMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreatorCreateLinkAfreecaCertMutationDto) =>
      axios.post<CreatorCreateLinkAfreecaCertMutationRes>('/link/afreeca/cert', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creatorProfile');
        // 아프리카 연동 요청 목록 재요청
        queryClient.invalidateQueries('creatorLinkAfreecaCert');
      },
    },
  );
};
