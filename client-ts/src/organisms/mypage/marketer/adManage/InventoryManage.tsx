import React from 'react';
import {
  makeStyles,
  Paper, Tab, Tabs
} from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import usePaginatedGetRequest from '../../../../utils/hooks/usePaginatedGetRequest';
import { useGetRequest } from '../../../../utils/hooks';
import { BannerDataInterface, UrlDataInterface } from './interface';
import BannerInventory from './banner/BannerInventory';
import UrlInventory from './url/UrlInventory';
import UrlButtons from './url/UrlButtons';
import BannerButtons from './banner/BannerButtons';

const useStyles = makeStyles((theme) => ({
  tabs: {
    padding: theme.spacing(2, 0, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  detail: {
    marginTop: theme.spacing(2),
  }
}));

const FETCH_PAGE_OFFSET = 5;

export default function InventoryManage(): JSX.Element {
  const classes = useStyles();

  const [selectedTabIndex, setSelectedTabIndex] = React.useState<string>('0');
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setSelectedTabIndex(newValue);
  };

  // **************************************************************************************
  // 배너 데이터
  const bannerPageLength = useGetRequest('/marketer/banner/length');
  const bannerData = usePaginatedGetRequest<BannerDataInterface>(
    '/marketer/banner/list', { offset: FETCH_PAGE_OFFSET, disableConcat: true }
  );

  // **************************************************************************************
  // URL 데이터
  const urlPageLength = useGetRequest('/marketer/landing-url/length');
  const urlData = usePaginatedGetRequest<UrlDataInterface>(
    '/marketer/landing-url/list', { offset: FETCH_PAGE_OFFSET, disableConcat: true }
  );


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
            <Tab label="배너 인벤토리" value="0" />
            <Tab label="URL 인벤토리" value="1" />
          </Tabs>

          {/* 선택된 탭의 컨텐츠 */}
          <div>

            <TabPanel value="0">
              <BannerButtons bannerData={bannerData} />
              <BannerInventory
                totalPageLength={bannerPageLength.data || undefined}
                pageOffset={FETCH_PAGE_OFFSET}
                bannerData={bannerData}
              />
            </TabPanel>

            <TabPanel value="1">
              <UrlButtons urlData={urlData} />
              <UrlInventory
                urlData={urlData}
                totalPageLength={urlPageLength.data || undefined}
                pageOffset={FETCH_PAGE_OFFSET}
              />
            </TabPanel>
          </div>

        </TabContext>
      </Paper>
    </div>
  );
}