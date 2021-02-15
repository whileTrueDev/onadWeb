import React, { useState } from 'react';
import {
  makeStyles,
  Paper, Tab, Tabs
} from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import usePaginatedGetRequest from '../../../../utils/hooks/usePaginatedGetRequest';
import { CampaignInterface } from '../dashboard/interfaces';
import { useGetRequest } from '../../../../utils/hooks';
import { BannerDataInterface, UrlDataInterface } from './interface';
import BannerInventory from './banner/BannerInventory';
import UrlInventory from './url/UrlInventory';
import CampaignInventory from './campaign/CampaignInventory';
import UrlButtons from './url/UrlButtons';
import BannerButtons from './banner/BannerButtons';
import CampaignButtons from './campaign/CampaignButtons';
import CampaignDetail from './campaign/CampaignDetail';

const useStyles = makeStyles((theme) => ({
  tabs: {
    padding: theme.spacing(2, 0, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  detail: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
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

  // **************************************************************************************
  // 배너 데이터
  const bannerPageLength = useGetRequest('/marketer/banner/length');
  const bannerData = usePaginatedGetRequest<BannerDataInterface>(
    '/marketer/banner/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, disableConcat: true }
  );

  // **************************************************************************************
  // URL 데이터
  const urlPageLength = useGetRequest('/marketer/landing-url/length');
  const urlData = usePaginatedGetRequest<UrlDataInterface>(
    '/marketer/landing-url/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, disableConcat: true }
  );

  // ****************************************
  // 선택된 캠페인
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignInterface>();
  function handleCampaignSelect(campaign: CampaignInterface): void {
    setSelectedCampaign(campaign);
  }


  return (
    <div>
      <Paper>
        <TabContext value={selectedTabIndex}>
          <Tabs
            indicatorColor="primary"
            value={selectedTabIndex}
            onChange={handleTabChange}
            className={classes.tabs}
          >
            <Tab label="캠페인 인벤토리" value="0" />
            <Tab label="배너 인벤토리" value="1" />
            <Tab label="URL 인벤토리" value="2" />
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

            <TabPanel value="1">
              <BannerButtons bannerData={bannerData} />
              <BannerInventory
                totalPageLength={bannerPageLength.data || undefined}
                pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
                bannerData={bannerData}
              />
            </TabPanel>

            <TabPanel value="2">
              <UrlButtons urlData={urlData} />
              <UrlInventory
                urlData={urlData}
                totalPageLength={urlPageLength.data || undefined}
                pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
              />
            </TabPanel>
          </div>

        </TabContext>
      </Paper>

      {/* 캠페인 개별 보기 컨텐츠 */}
      {selectedCampaign && (
        <Paper className={classes.detail}>
          <CampaignDetail selectedCampaign={selectedCampaign} />
        </Paper>
      )}
    </div>
  );
}
