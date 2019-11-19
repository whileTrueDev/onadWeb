import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { Grid, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
// own components
import Skeleton from '@material-ui/lab/Skeleton';
import Tabs from './sub/Tabs';
import IpToGeo from './sub/IpToGeo';
import ContentsTotal from './sub/ContentsTotal';
// hooks
import useFetchData from '../../../utils/lib/hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  grid: {
    justifyContent: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const MarketerReport = (props) => {
  const classes = useStyles();
  const { match } = props;

  const [period, setPeriod] = useState(0);
  const [dataSet, setDataSet] = useState();
  const reportData = useFetchData(
    '/api/dashboard/marketer/report', {
      campaignId: match.params.campaignId,
    }
  );
  const valueChartData = useFetchData(
    '/api/dashboard/marketer/report/totalSpendChart', {
      campaignId: match.params.campaignId,
    }
  );
  const ipToGeoData = useFetchData('/api/dashboard/marketer/geo/campaign', {
    campaignId: match.params.campaignId
  });


  const handleChange = (event) => {
    setPeriod(event.target.value);
    event.preventDefault();
    const dateArray = [];
    if (event.target.value === 0) {
      setDataSet(false);
    } else if (event.target.value === 1) {
      for (let i = 6; i <= 10; i += 1) {
        dateArray.push(reportData.payload[i]);
      }
      setDataSet(dateArray);
    } else if (event.target.value === 2) {
      for (let i = 11; i <= 15; i += 1) {
        dateArray.push(reportData.payload[i]);
      }
      setDataSet(dateArray);
    }
  };

  const [value, setValue] = React.useState(0);
  function handleTabChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Grid container>
      <Grid item xs={12} xl={8}>
        <Paper className={classes.root}>
          {reportData.loading && (
          <div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          )}
          {!reportData.loading
      && reportData.payload && !valueChartData.loading && valueChartData.payload && (
        <Grid container>
          {/* 헤드라인 */}
          <Grid item xs={12}>
            <div style={{ display: 'flex', padding: '24px 32px 0px 32px', justifyContent: 'space-between' }}>

              <div>
                {/* 제목 */}
                <Typography variant="h5" style={{ fontWeight: 500 }}>
                  {reportData.payload.campaignName}
                  &emsp;광고 효과 분석
                </Typography>
                {/* 탭 바 */}
                <Tabs value={value} handleChange={handleTabChange} />
              </div>

              {/* 날짜선택 */}
              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel>기간</InputLabel>
                  <Select
                    value={period}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value={0}>전체</MenuItem>
                    <MenuItem value={1}>최근 2주</MenuItem>
                    <MenuItem value={2}>최근 한 달</MenuItem>
                  </Select>
                </FormControl>
              </div>

            </div>
            <Divider />
          </Grid>

          {/* 컨텐츠 */}
          <Grid item xs={12}>
            {!reportData.loading && reportData.payload && (
            <div style={{ padding: '24px 32px' }}>
              {value === 0 && (
              <ContentsTotal
                period={period}
                reportData={reportData.payload}
                dataSet={dataSet}
                valueChartData={valueChartData}
              />
              )}
              {value === 1 && (
              <ContentsTotal
                period={period}
                reportData={reportData}
                dataSet={dataSet}
                valueChartData={valueChartData}
              />
              )}
              {value === 2 && (
                <div>
                  <ContentsTotal
                    period={period}
                    reportData={reportData}
                    dataSet={dataSet}
                    valueChartData={valueChartData}
                  />
                  <IpToGeo ipToGeoData={ipToGeoData} />
                </div>
              )}

            </div>
            )}
          </Grid>

        </Grid>
          )
      }
        </Paper>
      </Grid>
    </Grid>
  );
};
export default MarketerReport;
