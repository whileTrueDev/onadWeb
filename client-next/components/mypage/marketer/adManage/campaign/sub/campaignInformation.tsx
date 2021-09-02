import { Button, Divider, makeStyles, Tab, Tabs } from '@material-ui/core';
import { useState } from 'react';
import { CampaignInterface } from '../../../main/interfaces';
import { CONFIRM_STATE_CONFIRMED } from '../../../../../../utils/render_funcs/renderBannerConfirmState';
import CampaignDetail from './campaignDetail';
import OrderInventory from '../../../shared/merchandiseOrder/orderInventory';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(0, 0, 2),
  },
  contents: {
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2) },
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(1) },
  },
  tabs: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2, 0, 0),
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  openAnalysisButton: {
    margin: theme.spacing(2, 1, 0),
  },
}));

const CPS_OPTION_TYPE = 3; // CPS 캠페인 옵션 넘버
export interface CampaignInformationProps {
  campaign: CampaignInterface;
  analysisToggle: boolean;
  openAnalysis: () => void;
}
export default function CampaignInformation({
  campaign,
  analysisToggle,
  openAnalysis,
}: CampaignInformationProps): JSX.Element {
  const classes = useStyles();

  // 탭 설정
  const [selectedTabIndex, setSelectedTabIndex] = useState<string>('0');
  const handleTabChange = (
    event: React.ChangeEvent<Record<string, never>>,
    newValue: string,
  ): void => {
    setSelectedTabIndex(newValue);
  };

  return (
    <div className={classes.container}>
      <Tabs
        indicatorColor="primary"
        value={selectedTabIndex}
        onChange={handleTabChange}
        className={classes.tabs}
      >
        <Tab label="상세 정보" value="0" />
        {campaign.optionType === CPS_OPTION_TYPE && <Tab label="주문 및 판매관리" value="1" />}
      </Tabs>

      {selectedTabIndex === '0' && (
        <section id="campaign-analysis" className={classes.contents}>
          <CampaignDetail campaign={campaign} />
        </section>
      )}
      {selectedTabIndex === '1' && (
        <section id="campaign-analysis" className={classes.contents}>
          <OrderInventory by="merchandise" merchandiseId={campaign.merchandiseId} />
        </section>
      )}

      <Divider />

      {campaign.confirmState === CONFIRM_STATE_CONFIRMED && !analysisToggle && (
        <div className={classes.openAnalysisButton}>
          <Button onClick={openAnalysis} fullWidth size="large" variant="contained" color="default">
            분석정보보기
          </Button>
        </div>
      )}
    </div>
  );
}
