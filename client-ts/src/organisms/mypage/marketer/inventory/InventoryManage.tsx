import React from 'react';
import {
  Button,
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

export interface InventoryManageProps {
  handleItemSelect: (item: string) => void;
}
export default function InventoryManage({
  handleItemSelect
}: InventoryManageProps): JSX.Element {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setSelectedTabIndex(newValue);
  };

  const CAMPAIGN_LOAD_PAGE_OFFSET = 5;
  const campaignData = usePaginatedGetRequest<CampaignInterface>(
    '/marketer/campaign/list', { offset: CAMPAIGN_LOAD_PAGE_OFFSET, doNotConcatNewData: true }
  );

  const bannerData = useGetRequest<null, BannerDataInterface[] | null>('/marketer/banner/list');
  const urlData = useGetRequest<null, UrlDataInterface[] | null>('/marketer/landing-url/list');

  return (
    <Paper>
      <nav>
        <Tabs
          indicatorColor="primary"
          value={selectedTabIndex}
          onChange={handleTabChange}
          style={{ padding: '16px 0px 0px', borderBottom: '1px solid #ddd' }}
        >
          <Tab label="캠페인 인벤토리" />
          <Tab label="배너 인벤토리" />
          <Tab label="URL 인벤토리" />
        </Tabs>
      </nav>

      {/* 선택된 탭의 컨텐츠 */}
      <div>
        {selectedTabIndex === 0 && (
        <div style={{ padding: 16 }}>
          <div>
            <Button variant="outlined" color="primary">+ 캠페인 생성</Button>
          </div>
          <CampaignInventory
            pageOffset={CAMPAIGN_LOAD_PAGE_OFFSET}
            campaignData={campaignData}
            handleItemSelect={handleItemSelect}
          />
        </div>
        )}

        {selectedTabIndex === 1 && (
        <div style={{ padding: 16 }}>
          <BannerButtons bannerData={bannerData} />
          <BannerInventory
            bannerData={bannerData}
            handleItemSelect={handleItemSelect}
          />
        </div>
        )}

        {selectedTabIndex === 2 && (
        <div style={{ padding: 16 }}>
          <UrlButtons urlData={urlData} />
          <UrlInventory
            urlData={urlData}
            handleItemSelect={handleItemSelect}
          />
        </div>
        )}
      </div>
    </Paper>
  );
}
