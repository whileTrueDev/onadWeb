import React from 'react';
import {
  makeStyles,
  Paper, Tab, Tabs
} from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({
  tabs: {
    padding: theme.spacing(2, 0, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  container: { padding: theme.spacing(2) },
}));

export default function InventoryManage(): JSX.Element {
  const classes = useStyles();

  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setSelectedTabIndex(newValue);
  };

  const CAMPAIGN_LOAD_PAGE_OFFSET = 5;
  const campaignData = usePaginatedGetRequest<CampaignInterface>(
    '/marketer/campaign/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, doNotConcatNewData: true }
  );

  const bannerData = usePaginatedGetRequest<BannerDataInterface>(
    '/marketer/banner/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, doNotConcatNewData: true }
  );
  const urlData = useGetRequest<null, UrlDataInterface[] | null>('/marketer/landing-url/list');

  return (
    <Paper>
      <nav>
        <Tabs
          indicatorColor="primary"
          value={selectedTabIndex}
          onChange={handleTabChange}
          className={classes.tabs}
        >
          <Tab label="캠페인 인벤토리" />
          <Tab label="배너 인벤토리" />
          <Tab label="URL 인벤토리" />
        </Tabs>
      </nav>

      {/* 선택된 탭의 컨텐츠 */}
      <div>
        {selectedTabIndex === 0 && (
        <div className={classes.container}>
          <CampaignButtons />
          <CampaignInventory
            pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
            campaignData={campaignData}
          />
        </div>
        )}

        {selectedTabIndex === 1 && (
        <div className={classes.container}>
          <BannerButtons bannerData={bannerData} />
          <BannerInventory
            pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
            bannerData={bannerData}
          />
        </div>
        )}

        {selectedTabIndex === 2 && (
        <div className={classes.container}>
          <UrlButtons urlData={urlData} />
          <UrlInventory urlData={urlData} />
        </div>
        )}
      </div>
    </Paper>
  );
}
