import React from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { Grid, Divider } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// icons
import Assignment from '@material-ui/icons/Assignment';
import DonutSmall from '@material-ui/icons/DonutSmall';
import InsertChart from '@material-ui/icons/InsertChart';
import Whatshot from '@material-ui/icons/Whatshot';
import FiberNew from '@material-ui/icons/FiberNew';

import Card from '../../../../../../atoms/Card/Card';
import ReportStackedBar from '../../../../../../atoms/Chart/ReportStackedBar';

const EMERALD = '#00acc1';
const ORANGE = '#ff9800';

const makeContents = reportData => ({
  price: [
    {
      title: '광고 총 비용',
      value: Number(parseInt(reportData.totalCPM, 10) + parseInt(reportData.totalCPC, 10)),
      unit: '원'
    },
    {
      title: '배너광고 총 비용',
      value: Number(reportData.totalCPM),
      unit: '원'
    },
    {
      title: '클릭광고 총 비용',
      value: Number(reportData.totalCPC),
      unit: '원'
    }
  ],
  effect: [
    {
      title: '배너 총 노출 수',
      value: Number(reportData.totalViewCount),
      unit: '회'
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
  ]
});

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

export default function ContentsTotal(props) {
  const classes = useStyles();
  const { reportData, valueChartData } = props;
  const contents = makeContents(reportData);

  return (
    <Grid container spacing={4}>

      {/* 윗 라인 */}
      <Grid item xs={12} sm={6}>

        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <Assignment fontSize="large" className={classes.icon} style={{ color: EMERALD }} />
              <Typography gutterBottom variant="h5" align="center">
                비용
              </Typography>
            </div>
          </div>
          <Divider />

          {/* 광고 총 비용 */}
          {contents.price.map(content => (
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
                      style={{ color: EMERALD }}
                      end={content.value}
                    />
                  </Typography>
                  <Typography gutterBottom variant="body2">
                  &emsp;
                    {content.unit}
                  </Typography>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <Assignment fontSize="large" className={classes.icon} />
              <Typography gutterBottom variant="h5" align="center">
                효과
              </Typography>
            </div>
          </div>
          <Divider />

          {/* 광고 총 비용 */}
          {contents.effect.map(content => (
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
                  &emsp;
                    {content.unit}
                  </Typography>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </Grid>

      {/* 왼쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <InsertChart fontSize="large" className={classes.icon} style={{ color: EMERALD }} />
              <Typography variant="h5">
                광고 비용 그래프
              </Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.container}>
            <ReportStackedBar height={200} dataSet={valueChartData.payload[0]} />
          </div>
        </Card>

        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <DonutSmall fontSize="large" className={classes.icon} style={{ color: EMERALD }} />
              <Typography variant="h5">
                광고 비용 비율
              </Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.container}>
            {!reportData.loading && (
            <Pie
              height={140}
              data={{
                labels: ['CPM', 'CPC'],
                datasets: [{
                  data: [reportData.totalCPM, reportData.totalCPC],
                  backgroundColor: [EMERALD, ORANGE]
                }]
              }}
            />
            )}
          </div>
        </Card>
      </Grid>


      {/* 오른쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <FiberNew className={classes.icon} />
              <Typography variant="h5">지표 준비중!</Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.container}>
            <div style={{
              display: 'flex', height: 300, alignItems: 'center', justifyContent: 'center'
            }}
            >
              <div style={{ position: 'absolute' }}>
                <Whatshot fontSize="large" className={classes.icon} style={{ fontSize: 96, opacity: 0.6 }} />
              </div>
              <div style={{ zIndex: 1 }}>
                <Typography variant="caption">필요한 지표가 있으시면 support@onad.io로 아이디어를 전달해주시면 감사드리겠습니다.</Typography>
              </div>
            </div>

          </div>
        </Card>
      </Grid>
    </Grid>
  );
}
