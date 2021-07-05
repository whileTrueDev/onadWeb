import { useQuery } from 'react-query';
import axios from '../../axios';

export interface AfreecaLinkData {
  tempCode: string;
  creatorId: string;
  afreecaId: string;
  certState: number;
  createdAt: string;
}
const getCreatorLinkAfreecaCert = async () => {
  const res = await axios.get<AfreecaLinkData>('/link/afreeca/cert');
  return res.data;
};

export const useCreatorLinkAfreecaCert = () => {
  return useQuery('creatorLinkAfreecaCert', getCreatorLinkAfreecaCert);
};
