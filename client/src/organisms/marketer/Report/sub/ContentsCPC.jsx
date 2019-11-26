import React from 'react';
import CountUp from 'react-countup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Divider } from '@material-ui/core';
import Assignment from '@material-ui/icons/Assignment';
import InsertChart from '@material-ui/icons/InsertChart';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../atoms/Card/Card';
import ReportCard from './ReportCard';
import IpToGeo from './IpToGeo';
import IpToGeoTable from './IpToGeoTable';
import ClickHeatmap from '../../../../atoms/Chart/ClickHeatmap';

const EMERALD = '#00acc1';
const ORANGE = '#ff9800';

const useStyles = makeStyles(() => ({
  container: {
    padding: '14px 20px'
  },
  flex: {
    display: 'flex', alignItems: 'center'
  },
  flexCenter: {
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  contents: {
    padding: '16px 28px', display: 'flex', justifyContent: 'space-between'
  },
  icon: {
    color: ORANGE, marginRight: '5px'
  },
  value: {
    color: ORANGE, fontWeight: 700
  }
}));


const makeContents = reportData => [
  {
    title: 'CPC 총 비용',
    value: Number(reportData.totalCPC),
    unit: '원'
  },
  {
    title: '배너 총 클릭 수',
    value: Number(reportData.totalClick),
    unit: '회'
  },
  {
    title: '홈페이지 이동 수',
    value: Number(reportData.totalTransfer),
    unit: '회'
  },
];

export default function ContentsTotal(props) {
  const classes = useStyles();
  const {
    period, reportData, valueChartData, ipToGeoData
  } = props;
  const contents = makeContents(reportData);

  return (
    <Grid container spacing={4}>

      {/* 윗 라인 */}
      <Grid item xs={12}>
        <ReportCard
          period={period}
          reportData={reportData}
        />
      </Grid>

      {/* 왼쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <Assignment fontSize="large" className={classes.icon} />
              <Typography gutterBottom variant="h5" align="center">
                개요
              </Typography>
            </div>
          </div>
          <Divider />

          {/* 광고 총 비용 */}
          {contents.map(content => (
            <div key={content.title}>
              <div className={classes.contents}>
                <Typography gutterBottom variant="h6">
                  {content.title}
                </Typography>

                <div className={classes.flexCenter}>
                  <Typography gutterBottom variant="h5" className={classes.value}>
                    <CountUp
                      duration={1}
                      className={classes.value}
                      end={content.value}
                    />
                  </Typography>
                  <Typography gutterBottom variant="body2">
                    {content.unit}
                  </Typography>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </Grid>

      {/* 오른쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <InsertChart fontSize="large" style={{ color: EMERALD }} />
              <Typography variant="h5">
                날짜별 클릭
              </Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.container}>
            {!ipToGeoData.loading && (
              <ClickHeatmap />
            )}
          </div>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <BubbleChartIcon fontSize="large" style={{ color: EMERALD }} />
              <Typography variant="h5">
                지역별 클릭
              </Typography>
            </div>
          </div>
          <Divider />

          <Grid container className={classes.container} spacing={1}>
            <Grid item xs={12} md={6}>
              <IpToGeo data={ipToGeoData} />
            </Grid>

            <Grid item xs={12} md={6}>
              <IpToGeoTable data={ipToGeoData} />
            </Grid>
          </Grid>
        </Card>
      </Grid>

    </Grid>
  );
}
