import React, { useState } from 'react';
import PropTypes from 'prop-types';
//
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';

import ReportStackedBar from '../../../../atoms/Chart/ReportStackedBar';
import CardHeader from '../../../../atoms/Card/CardHeader';
import Card from '../../../../atoms/Card/Card';
import Button from '../../../../atoms/CustomButtons/Button';

import ReportTabsCard from './ReportTabsCard';
import IpToGeo from './IpToGeo';
import IpToGeoTable from './IpToGeoTable';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const TabPanel = (props) => {
  const {
    children, value, index, valueChartData, ...other
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
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ReportTabs = (props) => {
  const { classes, valueChartData, campaignId } = props;
  const styleClasses = useStyles();
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleShow = () => {
    setShow(!show);
  };

  const ipToGeoData = useFetchData('/api/dashboard/marketer/geo', { campaignId });

  return (
    <div className={styleClasses.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} style={{ backgroundColor: '#ff9800' }}>
          <Tab label="개요" />
          <Tab label="CPM" />
          <Tab label="CPC" />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} style={{ padding: 24 }}>
        <Grid container xs={12} spacing={3}>
          <Grid item xs={12}>
            {!show
              ? (
                <Button color="primary" onClick={handleShow}>
                  그래프 보기
                </Button>
              )
              : (
                <Button onClick={handleShow}>
                  그래프 숨기기
                </Button>
              )}
          </Grid>

          <ReportTabsCard />

          {show
          && (
          <Grid item xs={12}>
            <CardHeader color="blueGray">
            지출 추이
            </CardHeader>
            <Card>
              <ReportStackedBar height={100} dataSet={valueChartData.payload[0]} />
            </Card>
          </Grid>
          )
      }
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container xs={12} spacing={3}>
          <Grid item xs={12}>
            {!show
              ? (
                <Button color="primary" onClick={handleShow}>
              그래프 보기
                </Button>
              )
              : (
                <Button onClick={handleShow}>
                그래프 숨기기
                </Button>
              )
            }
          </Grid>

          <ReportTabsCard />
          {show
          && (
          <Grid item xs={12}>
            <CardHeader color="blueGray">
            지출 추이
            </CardHeader>
            <Card>
              <ReportStackedBar height={100} dataSet={valueChartData.payload[1]} />
            </Card>
          </Grid>
          )
      }
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Grid container>
          <Grid item xs={12}>
            {!show
              ? (
                <Button color="primary" onClick={handleShow}>
              그래프 보기
                </Button>
              )
              : (
                <Button onClick={handleShow}>
                그래프 숨기기
                </Button>
              )
            }
          </Grid>

          <ReportTabsCard />

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6">
              지역별 클릭
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <IpToGeo data={ipToGeoData} />
            </Grid>
            <Grid item xs={6}>
              <IpToGeoTable data={ipToGeoData} />
            </Grid>
          </Grid>

          {show
          && (
          <Grid item xs={12}>
            <CardHeader color="blueGray">
            지출 추이
            </CardHeader>
            <Card>
              <ReportStackedBar height={100} dataSet={valueChartData.payload[2]} />
            </Card>
          </Grid>
          )}
        </Grid>
      </TabPanel>
    </div>
  );
};


export default ReportTabs;
