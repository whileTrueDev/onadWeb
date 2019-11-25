import React from 'react';
import CountUp from 'react-countup';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Grid, Divider, Avatar } from '@material-ui/core';
import Assignment from '@material-ui/icons/Assignment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../atoms/Card/Card';
import ReportCard from './ReportCard';
import CreatorInfo from './CreatorInfo';


const makeContents = reportData => [
  {
    title: 'CPM 총 비용',
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

const creators = [
  {
    name: '화수르',
    twitchId: 'iamsupermazinga',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e14cbb83-71ba-46eb-8fc1-9fd484da2db2-profile_image-300x300.png',
    most_contents: '게임방송(오버워치)',
    total_ad_exposure_amount: 12345,
    avg_viewer: 150,
    avg_broadcast_time: '오전 7시 ~ 12시',
    avg_broadcast_time_amount: 7,
    total_ad_time: 123
  },
  {
    name: '화수르',
    twitchId: 'iamsupermazinga',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e14cbb83-71ba-46eb-8fc1-9fd484da2db2-profile_image-300x300.png',
    most_contents: '소통방송',
    total_ad_exposure_amount: 23424,
    avg_viewer: 123,
    avg_broadcast_time: '오전 7시 ~ 12시',
    avg_broadcast_time_amount: 3,
    total_ad_time: 142
  },
];

export default function ContentsTotal(props) {
  const { period, reportData, creatorsData } = props;
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
  const isMobileWidth = useMediaQuery('(max-width:959px)');
  const [howMuchCreator, setHowMuchCreator] = React.useState(30);
  React.useEffect(() => {
    if (isMobileWidth) {
      setHowMuchCreator(10);
    }
  }, [isMobileWidth]);


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
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Assignment fontSize="large" style={{ color: '#ff9800', marginRight: '5px' }} />
              <Typography gutterBottom variant="h5" align="center">
                개요
              </Typography>
            </div>
          </div>
          <Divider />

          {/* 광고 총 비용 */}
          {contents.map(content => (
            <div key={content.title}>
              <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6">
                  {content.title}
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography gutterBottom variant="h5" style={{ color: '#ff9800', fontWeight: 700 }}>
                    <CountUp
                      duration={1}
                      style={{ color: '#ff9800', fontWeight: 700 }}
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
          <div style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircle fontSize="large" style={{ color: '#00acc1', marginRight: '5px' }} />
              <Typography variant="h5">
                송출 크리에이터
              </Typography>
              <Typography variant="caption">(송출량 순)</Typography>
            </div>
          </div>
          <Divider />
          <div style={{ padding: '14px 20px' }}>
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

              {creators.length > 24 && (
              <Typography
                component="a"
                gutterBottom
                onClick={(e) => {
                  e.preventDefault();
                  // 더보기 핸들러
                  // handleMoreOpen();
                }}
              >
                ...
              </Typography>
              )}

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
      </Grid>

    </Grid>
  );
}
