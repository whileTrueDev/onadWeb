import { OnadAddressData } from '../../../../utils/hooks/query/useMarketerMerchandisesAddresses';
import { MerchandiseOption } from '../../../../utils/hooks/query/useMarketerMerchandisesList';

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
