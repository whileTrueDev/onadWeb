import React from 'react';
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
import useEventTargetValue from '../../../utils/lib/hooks/useEventTargetValue';

const useStyles = makeStyles(theme => ({
  headline: {
    display: 'flex',
    padding: '24px 32px 0px 32px',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 500
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  contents: {
    padding: '24px 32px'
  }
}));

const MarketerReport = (props) => {
  const classes = useStyles();
  const { match } = props;
  const period = useEventTargetValue('norange');

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
  const ipToGeoData = useFetchData(
    '/api/dashboard/marketer/geo/campaign', {
      campaignId: match.params.campaignId
    }
  );

  const creatorsData = useFetchData(
    '/api/dashboard/marketer/report/creators', {
      campaignId: match.params.campaignId,
    }
  );


  const [tabValue, setTabValue] = React.useState(0);
  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <Grid container>
      <Grid item xs={12} xl={8}>
        <Paper>
          {reportData.loading && (<ReportLoading />)}
          {!reportData.loading && reportData.payload
            && !valueChartData.loading && valueChartData.payload && (
            <Grid container>
              {/* 헤드라인 */}
              <Grid item xs={12}>
                <div className={classes.headline}>

                  <div>
                    {/* 제목 */}
                    <Typography variant="h5" className={classes.title}>
                      {reportData.payload.campaignName}
                      &emsp;광고 효과 분석
                    </Typography>
                    {/* 탭 바 */}
                    <Tabs value={tabValue} handleChange={handleTabChange} />
                  </div>

                  {/* 날짜선택 */}
                  <Hidden xsDown>
                    <FormControl className={classes.formControl}>
                      <InputLabel>기간</InputLabel>
                      <Select
                        value={period.value}
                        onChange={period.handleChange}
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
                <div className={classes.contents}>
                  <Hidden smUp>
                    <FormControl className={classes.formControl}>
                      <InputLabel>기간</InputLabel>
                      <Select
                        value={period.value}
                        onChange={period.handleChange}
                        displayEmpty
                      >
                        <MenuItem value="norange">전체</MenuItem>
                        <MenuItem value={14}>최근 2주</MenuItem>
                        <MenuItem value={30}>최근 한 달</MenuItem>
                      </Select>
                    </FormControl>
                  </Hidden>

                  {tabValue === 0 && (
                  <ContentsTotal
                    period={period.value}
                    reportData={reportData.payload}
                    valueChartData={valueChartData}
                  />
                  )}
                  {tabValue === 1 && (
                  <ContentsCPM
                    period={period.value}
                    reportData={reportData.payload}
                    valueChartData={valueChartData}
                    creatorsData={creatorsData}
                  />
                  )}
                  {tabValue === 2 && (
                  <ContentsCPC
                    period={period.value}
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
