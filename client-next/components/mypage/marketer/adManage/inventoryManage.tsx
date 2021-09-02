import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import * as React from 'react';
import BannerButtons from './banner/bannerButtons';
import BannerInventory from './banner/bannerInventory';
import MerchandiseButtons from './merchandise/merchandiseButtons';
import MerchandiseInventory from './merchandise/merchandiseInventory';
import UrlButtons from './url/urlButtons';
import UrlInventory from './url/urlInventory';

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
            <Tab label="상품 인벤토리" value="2" />
          </Tabs>

          {/* 선택된 탭의 컨텐츠 */}
          <div>
            {/* 배너 인벤토리 */}
            <TabPanel value="0">
              <BannerButtons />
              <BannerInventory />
            </TabPanel>

            {/* URL 인벤토리 */}
            <TabPanel value="1">
              <UrlButtons />
              <UrlInventory />
            </TabPanel>

            {/* 상품 인벤토리 */}
            <TabPanel value="2">
              <MerchandiseButtons />
              <MerchandiseInventory />
            </TabPanel>
          </div>
        </TabContext>
      </Paper>
    </div>
  );
}
