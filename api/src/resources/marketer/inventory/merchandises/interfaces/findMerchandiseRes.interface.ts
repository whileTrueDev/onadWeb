import { MerchandiseMallItems } from '../../../../../entities/MerchandiseMallItems';
import { MerchandiseOptions } from '../../../../../entities/MerchandiseOptions';
import { MerchandisePickupAddresses } from '../../../../../entities/MerchandisePickupAddresses';
import { MerchandiseRegistered } from '../../../../../entities/MerchandiseRegistered';

export type FindMerchandiseDetail = MerchandiseRegistered &
  Pick<MerchandiseMallItems, 'itemSiteUrl' | 'soldCount' | 'uploadState' | 'denialReason'>;

export type FindMerchandiseRes = FindMerchandiseDetail & {
  options?: MerchandiseOptions[];
  pickupAddress?: MerchandisePickupAddresses;
  images?: string;
  imagesRes?: string[];
};
