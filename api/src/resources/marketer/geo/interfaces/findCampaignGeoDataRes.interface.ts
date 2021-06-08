import { Lookup } from 'geoip-lite';

export type FindCampaignGeoData = Lookup & { latitude: number; longitude: number };

export type FindCampaignGeoDataRes = FindCampaignGeoData[];
