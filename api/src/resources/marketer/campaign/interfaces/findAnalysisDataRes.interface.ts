export interface FindAnalysisDataRes {
  campaignName: string;
  totalCPM: number;
  totalViewCount: number | null;
  totalCPC: number | null;
  adchatClick: string; // numberstring
  adpanelClick: string; // numberstring
}
