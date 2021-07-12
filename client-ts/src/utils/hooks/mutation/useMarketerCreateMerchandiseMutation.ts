import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';
import { OnadAddressData } from '../query/useMarketerMerchandisesAddresses';
import { Merchandise, MerchandiseOption } from '../query/useMarketerMerchandisesList';

export interface CreateMerchandiseDto {
  name: string;
  price: string | number;
  stock: string | number;
  description: string;
  images: string[];
  descImages: string[];
  optionFlag: boolean;
  pickupFlag: boolean;
  pickupAddress?: OnadAddressData;
  options?: MerchandiseOption[];
}

export const useMarketerCreateMerchandiseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: CreateMerchandiseDto) => axios.post<Merchandise>('/marketer/merchandises', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerMerchandisesList');
        queryClient.invalidateQueries('marketerMerchandisesLength');
        queryClient.invalidateQueries('marketerMerchandisesListOnlyNotConnected');
        queryClient.invalidateQueries('marketerMerchandisesAddresses');
      },
    },
  );
};
