import React from 'react';
import { Grid, Slide } from '@material-ui/core';
import { campaignInterface } from './interfaces';

import Dialog from '../../../../atoms/Dialog/Dialog';
import ReportLoading from './ReportLoading';
import CampaignBannerClickAd from './CampaignBannerClickAd';
import CampaignOnlyClickAd from './sub/CampaignOnlyClickAd';
import CampaignOnlyBannerAd from './sub/CampaignOnlyBannerAd';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { reportInterface, creatorDataInterface, heatmapInterface, geoInterface } from './interfaces';
const ONLY_BANNER_STATE = 0;
const BANNER_WITH_CLICK_STATE = 1;
const ONLY_CLICK_STATE = 2;

const Transition = React.forwardRef((props, ref) => (
  <Slide
    direction="up"
    ref={ref}
    {...props}
  />
));

interface propInterface {
  open: boolean;
  selectedCampaign: campaignInterface;
  handleClose: () => void;
  SLIDE_TIMEOUT: number;
}

export default function CampaignReportDialog(props: propInterface) {
  const {
    SLIDE_TIMEOUT, selectedCampaign, open, handleClose
  } = props;

  const reportData = useGetRequest<{ campaignId: string }, reportInterface>(
    '/marketer/campaign/analysis',
    { campaignId: selectedCampaign.campaignId }
  );

  const chartData = useGetRequest<{ campaignId: string }, any[]>(
    '/marketer/campaign/analysis/expenditure',
    { campaignId: selectedCampaign.campaignId }
  );

  //라우터 추가가 필요하다.
  const ipToGeoData = useGetRequest<{ campaignId: string }, geoInterface[]>(
    '/marketer/geo/campaign',
    { campaignId: selectedCampaign.campaignId }
  );

  const creatorsData = useGetRequest<{ campaignId: string }, creatorDataInterface[]>(
    '/marketer/campaign/analysis/creator-data',
    { campaignId: selectedCampaign.campaignId }
  );

  const clickData = useGetRequest<{ campaignId: string }, heatmapInterface[]>(
    '/marketer/campaign/analysis/heatmap',
    { campaignId: selectedCampaign.campaignId }
  );

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

          {/* Only CPC (클릭 광고인 경우) */}
          {selectedCampaign.optionType === ONLY_CLICK_STATE && (
            <CampaignOnlyClickAd
              selectedCampaign={selectedCampaign}
              reportData={reportData}
              chartData={chartData}
              ipToGeoData={ipToGeoData}
              clickData={clickData}
            />
          )}


          {/* Only CPM (배너 광고인 경우) */}
          {selectedCampaign.optionType === ONLY_BANNER_STATE && (
            <CampaignOnlyBannerAd
              selectedCampaign={selectedCampaign}
              reportData={reportData}
              chartData={chartData}
              creatorsData={creatorsData}
            />
          )}

          {/* CPM + CPC (배너 광고 + 클릭 광고인 경우) */}
          {selectedCampaign.optionType === BANNER_WITH_CLICK_STATE && (
            <CampaignBannerClickAd
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
