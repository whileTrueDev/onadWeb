import React from 'react';
// for Link tag component
// @material-ui/core
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import CustomButton from '../../../atoms/CustomButtons/Button';

import BannerTable from '../../../organisms/mypage/marketer/inventory/BannerTable';
import UploadDialog from '../../../organisms/mypage/marketer/shared/BannerUploadDialog';
import DeleteDialog from '../../../organisms/mypage/marketer/inventory/DeleteDialog';
import UrlTable from '../../../organisms/mypage/marketer/inventory/UrlTable';
import UrlUploadDialog from '../../../organisms/mypage/marketer/shared/UrlUploadDialog';
import UrlDeleteDialog from '../../../organisms/mypage/marketer/inventory/UrlDeleteDialog';

// core ../../atoms
import dashboardStyle from '../../../assets/jss/views/dashboardStyle';
import useDialog from '../../../utils/hooks/useDialog';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import { BannerDataInterface, UrlDataInterface } from '../../../organisms/mypage/marketer/inventory/interface';


function TabPanel(props: any): JSX.Element {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component={Paper}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Inventory = (): JSX.Element => {
  const bannerData = useGetRequest<null, BannerDataInterface[] | null>('/marketer/banner/list');
  const urlData = useGetRequest<null, UrlDataInterface[] | null>('/marketer/landing-url/list');

  // banner
  const deleteDialog = useDialog();
  const uploadDialog = useDialog();
  // landing url
  const urlDeleteDialog = useDialog();
  const urlUploadDialog = useDialog();

  const classes = useStyles();
  const [value, setValue] = React.useState<number>(0);
  const [selectedBanner, setBanner] = React.useState<BannerDataInterface | null>(null);
  const [selectedUrl, setUrl] = React.useState<UrlDataInterface | null>(null);


  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <GridContainer>
      <GridItem xs={12} xl={11}>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="배너 인벤토리" {...a11yProps(0)} />
              <Tab label="URL 인벤토리" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <CustomButton color="primary" size="large" onClick={(): void => { uploadDialog.handleOpen(); }}>
              + 새 배너 등록
            </CustomButton>
            <BannerTable
              handleDeleteOpen={deleteDialog.handleOpen}
              setBanner={setBanner}
              fetchData={bannerData}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CustomButton color="primary" size="large" onClick={(): void => { urlUploadDialog.handleOpen(); }}>
              + 새 URL 등록
            </CustomButton>
            <UrlTable
              handleDeleteOpen={urlDeleteDialog.handleOpen}
              setUrl={setUrl}
              fetchData={urlData}
            />
          </TabPanel>
        </div>
      </GridItem>

      {/* banner upload, delete dialog */}
      <UploadDialog
        open={uploadDialog.open}
        onClose={uploadDialog.handleClose}
        recallRequest={bannerData.doGetRequest}
      />
      {deleteDialog.open && selectedBanner && (
        <DeleteDialog
          open={deleteDialog.open}
          selectedBanner={selectedBanner}
          handleClose={deleteDialog.handleClose}
          recallRequest={bannerData.doGetRequest}

        />
      )}

      {/* landing url upload, delete dialog */}
      <UrlUploadDialog
        open={urlUploadDialog.open}
        handleClose={urlUploadDialog.handleClose}
        recallRequest={urlData.doGetRequest}
      />
      {urlDeleteDialog.open && selectedUrl && (
        <UrlDeleteDialog
          open={urlDeleteDialog.open}
          selectedUrl={selectedUrl}
          handleClose={urlDeleteDialog.handleClose}
          recallRequest={urlData.doGetRequest}

        />
      )}

    </GridContainer>

  );
};


export default withStyles(dashboardStyle)(Inventory);
// export default Inventory;
