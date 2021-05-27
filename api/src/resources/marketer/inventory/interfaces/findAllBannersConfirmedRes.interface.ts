import { BannerRegistered } from '../../../../entities/BannerRegistered';

export type FindAllBannersConfirmedRes = Array<
  Pick<BannerRegistered, 'bannerSrc' | 'bannerSrcUrl' | 'bannerId'>
>;
