import { useQuery } from 'react-query';
import axios from '../../axios';
import { CreatorProfile } from './useCreatorProfile';
import { MarketerInfo } from './useMarketerProfile';

export type CreatorOrMarketerParams = 'creator' | 'marketer';

const getProfileByUserType = async (userType: CreatorOrMarketerParams) => {
  if (userType === 'creator') {
    return axios.get<CreatorProfile>(`/${userType}`).then(res => res.data);
  }
  return axios.get<MarketerInfo>(`/${userType}`).then(res => res.data);
};

export const useProfileByUserType = (userType: CreatorOrMarketerParams) => {
  return useQuery(`${userType}Profile`, () => getProfileByUserType(userType), {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
