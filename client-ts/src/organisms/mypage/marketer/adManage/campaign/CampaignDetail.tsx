import {
  Button,
  Divider,
  Hidden, makeStyles, Paper
} from '@material-ui/core';
import React from 'react';
import { CampaignInterface } from '../../dashboard/interfaces';
import CampaignInformation from './sub/CampaignInformation';
import CampaignMetaInfoCard from './sub/CampaignMetaInfoCard';
import CampaignAnalysis from './sub/CampaignAnalysis';
import { useToggle } from '../../../../../utils/hooks';
import { CONFIRM_STATE_CONFIRMED } from '../../../../../utils/render_funcs/renderBannerConfirmState';

const useStyles = makeStyles((theme) => ({
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
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    }
  },
  openAnalysisButton: {
    marginTop: theme.spacing(2)
  }
}));

export interface CampaignDetailProps {
  selectedCampaign: CampaignInterface;
}
export default function CampaignDetail({
  selectedCampaign,
}: CampaignDetailProps): JSX.Element {
  const classes = useStyles();

  const analysisToggle = useToggle();
  React.useEffect(() => {
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
        <CampaignInformation campaign={selectedCampaign} />

        <Divider />
        {selectedCampaign.confirmState === CONFIRM_STATE_CONFIRMED && !analysisToggle.toggle && (
        <div className={classes.openAnalysisButton}>
          <Button
            onClick={analysisToggle.handleToggle}
            fullWidth
            size="large"
            variant="contained"
            color="default"
          >
            분석정보보기
          </Button>
        </div>
        )}

        {/* 캠페인 분석 정보 */}
        {selectedCampaign.confirmState === CONFIRM_STATE_CONFIRMED && analysisToggle.toggle && (
        <CampaignAnalysis campaignId={selectedCampaign.campaignId} />
        )}

      </Paper>
    </div>
  );
}
