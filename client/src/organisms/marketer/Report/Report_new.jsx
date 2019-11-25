import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { Grid, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Hidden from '@material-ui/core/Hidden';
// own components
import Tabs from './sub/Tabs';
import ContentsTotal from './sub/ContentsTotal';
import ContentsCPM from './sub/ContentsCPM';
import ContentsCPC from './sub/ContentsCPC';
import ReportLoading from './sub/ReportLoading';
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

  const [period, setPeriod] = useState('norange');
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

  const creatorsData = useFetchData(
    '/api/dashboard/marketer/report/creators', {
      campaignId: match.params.campaignId,
    }
  );

  const handleChange = (event) => {
    event.preventDefault();
    setPeriod(event.target.value);
  };

  const [value, setValue] = React.useState(0);
  function handleTabChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Grid container>
      <Grid item xs={12} xl={8}>
        <Paper className={classes.root}>
          {reportData.loading && (<ReportLoading />)}
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
              <Hidden xsDown>
                <FormControl className={classes.formControl}>
                  <InputLabel>기간</InputLabel>
                  <Select
                    value={period}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="norange">전체</MenuItem>
                    <MenuItem value={14}>최근 2주</MenuItem>
                    <MenuItem value={30}>최근 한 달</MenuItem>
                  </Select>
                </FormControl>
              </Hidden>

            </div>
            <Divider />
          </Grid>

          {/* 컨텐츠 */}
          <Grid item xs={12}>
            {!reportData.loading && reportData.payload && (
            <div style={{ padding: '24px 32px' }}>
              <Hidden smUp>
                <FormControl className={classes.formControl}>
                  <InputLabel>기간</InputLabel>
                  <Select
                    value={period}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="norange">전체</MenuItem>
                    <MenuItem value={14}>최근 2주</MenuItem>
                    <MenuItem value={30}>최근 한 달</MenuItem>
                  </Select>
                </FormControl>
              </Hidden>

              {value === 0 && (
              <ContentsTotal
                period={period}
                reportData={reportData.payload}
                valueChartData={valueChartData}
              />
              )}
              {value === 1 && (
              <ContentsCPM
                period={period}
                reportData={reportData.payload}
                valueChartData={valueChartData}
                creatorsData={creatorsData}
              />
              )}
              {value === 2 && (
              <ContentsCPC
                period={period}
                reportData={reportData.payload}
                valueChartData={valueChartData}
                ipToGeoData={ipToGeoData}
              />
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
