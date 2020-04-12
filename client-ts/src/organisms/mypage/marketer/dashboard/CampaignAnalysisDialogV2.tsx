import React from 'react';
import { Grid, Slide } from '@material-ui/core';
import {
  CampaignInterface, ReportInterfaceV2,
  CreatorDataInterface, HeatmapInterface, GeoInterface
} from './interfaces';
import Dialog from '../../../../atoms/Dialog/Dialog';
import ReportLoading from '../campaign-report/ReportLoading';
import LiveBannerAd from '../campaign-report/LiveBannerAd';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';

const BANNER_WITH_CLICK_STATE = 1; // "생방송 배너 광고" 
// Dialog Transition 컴포넌트
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

interface CampaignAnalysisDialogV2Props {
  open: boolean; selectedCampaign: CampaignInterface;
  handleClose: () => void; SLIDE_TIMEOUT: number;
}
export default function CampaignAnalysisDialogV2({
  SLIDE_TIMEOUT, selectedCampaign, open, handleClose
}: CampaignAnalysisDialogV2Props): JSX.Element {
  const ipToGeoData = useGetRequest<{ campaignId: string }, GeoInterface[] | null>(
    '/marketer/geo/campaign',
    { campaignId: selectedCampaign.campaignId }
  );

  const reportData = useGetRequest<{ campaignId: string }, ReportInterfaceV2 | null>(
    '/marketer/campaign/analysis',
    { campaignId: selectedCampaign.campaignId }
  );

  const chartData = useGetRequest<{ campaignId: string }, any[]>(
    '/marketer/campaign/analysis/v1/expenditure',
    { campaignId: selectedCampaign.campaignId }
  );

  const creatorsData = useGetRequest<{ campaignId: string }, CreatorDataInterface[] | null>(
    '/marketer/campaign/analysis/v1/creator-data',
    { campaignId: selectedCampaign.campaignId }
  );

  const clickData = useGetRequest<{ campaignId: string }, HeatmapInterface[] | null>(
    '/marketer/campaign/analysis/heatmap',
    { campaignId: selectedCampaign.campaignId }
  );

  console.log(ipToGeoData);

  return (
    <Dialog
      fullScreen
      disableBackdropClick
      title="캠페인 효과 분석"
      open={Boolean(open)}
      onClose={handleClose}
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: { enter: SLIDE_TIMEOUT, exit: SLIDE_TIMEOUT }
      }}
    >
      <Grid container>
        <Grid item xl={3} />
        <Grid item xs={12} xl={6}>
          {/* 로딩중 화면 */}
          {(reportData.loading || chartData.loading
            || ipToGeoData.loading || creatorsData.loading
            || clickData.loading) && (<ReportLoading />)}

          {/* 로딩 이후 화면 */}

          {/* CPM + CPC (배너 광고 + 클릭 광고인 경우) */}
          {selectedCampaign.optionType === BANNER_WITH_CLICK_STATE && (
            <LiveBannerAd
              selectedCampaign={selectedCampaign}
              reportData={reportData}
              chartData={chartData}
              ipToGeoData={ipToGeoData}
              creatorsData={creatorsData}
              clickData={clickData}
            />
          )}
        </Grid>
        <Grid item xl={3} />
      </Grid>
    </Dialog>
  );
}
