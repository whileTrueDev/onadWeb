import React from 'react';
// for Link tag component
// @material-ui/core
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import CustomButton from '../../atoms/CustomButtons/Button';

import BannerTable from '../../organisms/marketer/BannerManage/BannerTable';
import UploadDialog from '../../organisms/marketer/BannerManage/UploadDialog';
import DeleteDialog from '../../organisms/marketer/BannerManage/DeleteDialog';
import UrlTable from '../../organisms/marketer/BannerManage/UrlTable';
import UrlUploadDialog from '../../organisms/marketer/BannerManage/UrlUploadDialog';
import UrlDeleteDialog from '../../organisms/marketer/BannerManage/UrlDeleteDialog';

// core ../../atoms
import dashboardStyle from '../../assets/jss/onad/views/dashboardStyle';

import useDialog from '../../utils/lib/hooks/useDialog';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const BannerManage = () => {
  // banner
  const deleteDialog = useDialog();
  const uploadDialog = useDialog();
  // landing url
  const urlDeleteDialog = useDialog();
  const urlUploadDialog = useDialog();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
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
            <CustomButton color="info" size="lg" onClick={() => { uploadDialog.handleOpen(); }}>
              + 새 배너 등록
            </CustomButton>
            <BannerTable handleDeleteOpen={deleteDialog.handleOpen} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CustomButton color="info" size="lg" onClick={() => { uploadDialog.handleOpen(); }}>
              + 새 URL 등록
            </CustomButton>
            <UrlTable handleDeleteOpen={urlDeleteDialog.handleOpen} />
          </TabPanel>
        </div>
      </GridItem>

    {/* banner upload, delete dialog */}
      <UploadDialog
        open={uploadDialog.open}
        onClose={uploadDialog.handleClose}
      />
      {Boolean(deleteDialog.open) && (
        <DeleteDialog
          open={Boolean(deleteDialog.open)}
          selectedBanner={deleteDialog.open}
          handleClose={deleteDialog.handleClose}
        />
      )}

    {/* landing url upload, delete dialog */}
    <UrlUploadDialog
        open={urlUploadDialog.open}
        onClose={urlUploadDialog.handleClose}
      />
      {Boolean(urlDeleteDialog.open) && (
        <UrlDeleteDialog
          open={Boolean(urlDeleteDialog.open)}
          selectedUrl={urlDeleteDialog.open}
          handleClose={urlDeleteDialog.handleClose}
        />
      )}

    </GridContainer>

  );
};

export default withStyles(dashboardStyle)(BannerManage);
