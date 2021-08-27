import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import * as React from 'react';
import { useState } from 'react';
import { useMarketerCampaignList } from '../../../../utils/hooks/query/useMarketerCampaignList';
import OnOffSwitch from '../shared/OnOffSwitch';
import CampaignButtons from './campaign/campaignButtons';
import CampaignDetail from './campaign/campaignDetail';
import CampaignInventory from './campaign/campaignInventory';

const useStyles = makeStyles(theme => ({
  tabs: {
    padding: theme.spacing(2, 0, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  detail: {
    marginTop: theme.spacing(2),
  },
}));

export default function InventoryManage(): JSX.Element {
  const classes = useStyles();

  const [selectedTabIndex, setSelectedTabIndex] = React.useState<string>('0');
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setSelectedTabIndex(newValue);
  };

  // **************************************************************************************
  // 캠페인 데이터
  const CAMPAIGN_LOAD_PAGE_OFFSET = 5;
  const [page, setPage] = useState(0);
  const handlePage = (targetPage: number) => setPage(targetPage);
  const campaigns = useMarketerCampaignList({ offset: CAMPAIGN_LOAD_PAGE_OFFSET, page });

  // ****************************************
  // 선택된 캠페인
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>();
  function handleCampaignSelect(campaignId: string | undefined): void {
    setSelectedCampaignId(campaignId);
  }

  const selectedCampaign =
    campaigns.data && campaigns.data.find(cam => cam.campaignId === selectedCampaignId);

  return (
    <div>
      <div style={{ marginTop: 8, maxWidth: 320 }}>
        <OnOffSwitch />
      </div>

      <Paper style={{ marginTop: 8 }}>
        <TabContext value={selectedTabIndex}>
          <Tabs
            indicatorColor="primary"
            value={selectedTabIndex}
            onChange={handleTabChange}
            className={classes.tabs}
          >
            <Tab label="캠페인 관리" value="0" />
          </Tabs>

          {/* 선택된 탭의 컨텐츠 */}
          <div>
            <TabPanel value="0">
              <CampaignButtons />
              <CampaignInventory
                currentPage={page}
                pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
                handlePage={handlePage}
                handleCampaignSelect={handleCampaignSelect}
              />
            </TabPanel>
          </div>
        </TabContext>
      </Paper>

      {/* 캠페인 개별 보기 컨텐츠 */}
      {campaigns.data && selectedCampaign && (
        <div className={classes.detail}>
          <CampaignDetail selectedCampaign={selectedCampaign} />
        </div>
      )}
    </div>
  );
}
