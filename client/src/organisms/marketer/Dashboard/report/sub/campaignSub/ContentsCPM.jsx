import React from 'react';
import CountUp from 'react-countup';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Divider, Avatar } from '@material-ui/core';
import Assignment from '@material-ui/icons/Assignment';
import DonutSmall from '@material-ui/icons/DonutSmall';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../../../atoms/Card/Card';
import Pie from '../../../../../../atoms/Chart/PieChart';
import CreatorInfo from './CreatorInfo';

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
    title: '배너광고 총 비용',
    value: Number(reportData.totalCPM),
    unit: '원'
  },
  {
    title: '배너 총 노출 수',
    value: Number(reportData.totalViewCount),
    unit: '회'
  },
  {
    title: '채팅 내 언급 수',
    value: 0,
    unit: '(준비중입니다.)' // 회
  },
  {
    title: '크리에이터 구두 언급 수',
    value: 0,
    unit: '(준비중입니다.)' // 회
  },
  {
    title: '시청자 수 대비 언급 비율',
    value: 0,
    unit: '(준비중입니다.)' // %
  },
];

export default function ContentsTotal(props) {
  const { reportData, creatorsData } = props;
  const contents = makeContents(reportData);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dataindex, setDataIndex] = React.useState(0);

  const handleClick = (event, index) => {
    setDataIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 화면 크기에 따라 크리에이터 목록 개수 조절을 위해
  const isMobileWidth = useMediaQuery('(max-width:1024px)');
  const [howMuchCreator, setHowMuchCreator] = React.useState(30);
  React.useEffect(() => {
    if (isMobileWidth) {
      setHowMuchCreator(10);
    }
  }, [isMobileWidth]);

  const classes = useStyles();

  return (
    <Grid container spacing={4}>

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

      {/* 오른쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div className={classes.container}>
            <div className={classes.flex}>
              <AccountCircle fontSize="large" className={classes.icon} style={{ color: EMERALD }} />
              <Typography variant="h5">
                송출 크리에이터
              </Typography>
              <Typography variant="caption">(송출량 순)</Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.container}>
            <Grid container>
              {creatorsData.payload.slice(0, howMuchCreator).map((creator, index) => (
                <Grid key={creator.creatorName} item xs={6} md={4} lg={2} style={{ padding: 8 }}>
                  <Avatar
                    style={{ cursor: 'pointer' }}
                    src={creator.creatorLogo}
                    alt={creator.creatorName}
                    onClick={(e) => { handleClick(e, index); }}
                  />
                  <Typography variant="body1">{creator.creatorName}</Typography>
                </Grid>
              ))}

              {!creatorsData.loading && (
              <CreatorInfo
                creatorInfo={creatorsData.payload[dataindex]}
                anchorEl={anchorEl}
                handleClose={handleClose}
              />
              )}
            </Grid>
          </div>
        </Card>

        {useMediaQuery('(max-width:959px)') ? (null) : (
          <Card>
            <div className={classes.container}>
              <div className={classes.flex}>
                <DonutSmall fontSize="large" className={classes.icon} style={{ color: EMERALD }} />
                <Typography gutterBottom variant="h5" align="center">
                  크리에이터 비율
                </Typography>
              </div>
            </div>
            <Divider />

            <div className={classes.container}>
              <Grid container>
                <Pie
                  height={140}
                  labels={creatorsData.payload.slice(0, howMuchCreator).map(d => d.creatorName)}
                  data={creatorsData.payload
                    .slice(0, howMuchCreator)
                    .map(d => (d.total_ad_exposure_amount))}
                  options={{ legend: { display: true, position: 'right' } }}
                />
              </Grid>
            </div>
          </Card>
        )}
      </Grid>
    </Grid>
  );
}
