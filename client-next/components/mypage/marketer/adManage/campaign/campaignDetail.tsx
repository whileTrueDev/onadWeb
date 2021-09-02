import { Hidden, makeStyles, Paper } from '@material-ui/core';
import { useEffect } from 'react';
import { CampaignInterface } from '../../main/interfaces';
import CampaignInformation from './sub/campaignInformation';
import CampaignMetaInfoCard from './sub/campaignMetaInfoCard';
import CampaignAnalysis from './sub/campaignAnalysis';
import { useToggle } from '../../../../../utils/hooks';
import { CONFIRM_STATE_CONFIRMED } from '../../../../../utils/render_funcs/renderBannerConfirmState';
import {
  CPS_OPTION_TYPE,
  LIVE_BANNER_OPTION_TYPE,
} from '../../../../../utils/render_funcs/renderOptionType';
import CampaignAnalysisCPS from './sub/campaignAnalysisCPS';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  description: {
    width: '100%',
    overflow: 'auto',
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(0, 0, 0, 2),
    },
  },
  contents: {
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2) },
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(1) },
  },
}));

export interface CampaignDetailProps {
  selectedCampaign: CampaignInterface;
}
export default function CampaignDetail({ selectedCampaign }: CampaignDetailProps): JSX.Element {
  const classes = useStyles();

  const analysisToggle = useToggle();
  useEffect(() => {
    if (analysisToggle.toggle) analysisToggle.handleToggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaign]);
  return (
    <div className={classes.container}>
      {/* 캠페인 메타정보 카드 */}
      <Hidden mdDown>
        <CampaignMetaInfoCard campaign={selectedCampaign} />
      </Hidden>

      <Paper className={classes.description}>
        {/* 캠페인 메타정보 카드 */}
        <Hidden lgUp>
          <CampaignMetaInfoCard campaign={selectedCampaign} />
        </Hidden>

        {/* 캠페인 상세 정보 */}
        <CampaignInformation
          campaign={selectedCampaign}
          analysisToggle={analysisToggle.toggle}
          openAnalysis={analysisToggle.handleToggle}
        />

        {/* 라이브 배너 광고 캠페인 분석 정보 */}
        {selectedCampaign.confirmState === CONFIRM_STATE_CONFIRMED &&
          analysisToggle.toggle &&
          selectedCampaign.optionType === LIVE_BANNER_OPTION_TYPE && (
            <div className={classes.contents}>
              <CampaignAnalysis campaignId={selectedCampaign.campaignId} />
            </div>
          )}

        {/* CPS 광고 캠페인 분석 정보 */}
        {selectedCampaign.confirmState === CONFIRM_STATE_CONFIRMED &&
          analysisToggle.toggle &&
          selectedCampaign.optionType === CPS_OPTION_TYPE && (
            <div className={classes.contents}>
              <CampaignAnalysisCPS campaignId={selectedCampaign.campaignId} />
            </div>
          )}
      </Paper>
    </div>
  );
}
