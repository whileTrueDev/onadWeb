import { Campaign } from '../../../../entities/Campaign';

export type FindCampaignByBannerIdRes = Array<Pick<Campaign, 'campaignId'>>;
