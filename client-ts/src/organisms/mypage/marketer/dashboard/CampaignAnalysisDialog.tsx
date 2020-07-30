import React from 'react';
import { TransitionProps } from '@material-ui/core/transitions';
import { Grid, Slide } from '@material-ui/core';
import {
  CampaignInterface, ReportInterface,
  CreatorDataInterface, HeatmapInterface, GeoInterface
} from './interfaces';

import Dialog from '../../../../atoms/Dialog/Dialog';
import ReportLoading from '../campaign-report/ReportLoading';
import CampaignBannerClickAd from '../campaign-report/CampaignBannerClickAd';
import CampaignOnlyClickAd from '../campaign-report/CampaignOnlyClickAd';
import CampaignOnlyBannerAd from '../campaign-report/CampaignOnlyBannerAd';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';

const ONLY_BANNER_STATE = 0;
const BANNER_WITH_CLICK_STATE = 1; // "생방송 배너 광고" 
const ONLY_CLICK_STATE = 2;

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface CampaignReportDialogProps {
  open: boolean;
  selectedCampaign: CampaignInterface;
  handleClose: () => void;
  SLIDE_TIMEOUT: number;
}

export default function CampaignReportDialog(props: CampaignReportDialogProps): JSX.Element {
  const {
    SLIDE_TIMEOUT, selectedCampaign, open, handleClose
  } = props;

  const ipToGeoData = useGetRequest<{ campaignId: string }, GeoInterface[] | null>(
    '/marketer/geo/v1/campaign/',
    { campaignId: selectedCampaign.campaignId }
  );

  const reportData = useGetRequest<{ campaignId: string }, ReportInterface | null>(
    '/marketer/campaign/analysis/v1',
    { campaignId: selectedCampaign.campaignId }
  );

  const chartData = useGetRequest<{ campaignId: string }, any[]>(
    '/marketer/campaign/analysis/v1/expenditure',
    { campaignId: selectedCampaign.campaignId }
  );

  const creatorsData = useGetRequest<{ campaignId: string }, CreatorDataInterface[] | null>(
    '/marketer/campaign/analysis/creator-data',
    { campaignId: selectedCampaign.campaignId }
  );

  const clickData = useGetRequest<{ campaignId: string }, HeatmapInterface[] | null>(
    '/marketer/campaign/analysis/v1/heatmap',
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
