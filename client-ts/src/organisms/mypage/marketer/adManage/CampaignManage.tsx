import React, { useState } from 'react';
import {
  makeStyles,
  Paper, Tab, Tabs
} from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import usePaginatedGetRequest from '../../../../utils/hooks/usePaginatedGetRequest';
import { CampaignInterface, OnOffInterface } from '../dashboard/interfaces';
import { useGetRequest } from '../../../../utils/hooks';
import CampaignInventory from './campaign/CampaignInventory';
import CampaignButtons from './campaign/CampaignButtons';
import CampaignDetail from './campaign/CampaignDetail';
import OnOffSwitch from '../shared/OnOffSwitch';

const useStyles = makeStyles((theme) => ({
  tabs: {
    padding: theme.spacing(2, 0, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  detail: {
    marginTop: theme.spacing(2),
  }
}));

export default function InventoryManage(): JSX.Element {
  const classes = useStyles();

  const [selectedTabIndex, setSelectedTabIndex] = React.useState<string>('0');
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setSelectedTabIndex(newValue);
  };

  // **************************************************************************************
  // 캠페인 데이터
  const CAMPAIGN_LOAD_PAGE_OFFSET = 5;
  const campaignPageLength = useGetRequest('/marketer/campaign/length');
  const campaignData = usePaginatedGetRequest<CampaignInterface>(
    '/marketer/campaign/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, disableConcat: true }
  );

  // ****************************************
  // 선택된 캠페인
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>();
  function handleCampaignSelect(campaignId: string | undefined): void {
    setSelectedCampaignId(campaignId);
  }

  const selectedCampaign = campaignData.data && campaignData.data.find(
    (cam) => cam.campaignId === selectedCampaignId
  );

  // ********************************************
  // 광고주 캠페인 On/Off
  const onOffData = useGetRequest<null, OnOffInterface | null>('/marketer/ad/on-off');

  return (
    <div>
      <div style={{ marginTop: 8, maxWidth: 320 }}>
        <OnOffSwitch onOffData={onOffData} />
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
                pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
                campaignData={campaignData}
                pageLength={campaignPageLength.data || undefined}
                handleCampaignSelect={handleCampaignSelect}
              />
            </TabPanel>

          </div>

        </TabContext>
      </Paper>

      {/* 캠페인 개별 보기 컨텐츠 */}
      {campaignData.data && selectedCampaign && (
        <div className={classes.detail}>
          <CampaignDetail selectedCampaign={selectedCampaign} />
        </div>
      )}
    </div>
  );
}
