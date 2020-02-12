import React from 'react';
import {
  Grid, Avatar, Chip, Typography, Badge, CircularProgress
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import Skeleton from '@material-ui/lab/Skeleton';
import Error from '@material-ui/icons/Error';
import ReChartPie from '../../../../atoms/Chart/ReChartPie';

// usehook
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5)
  },
  loading: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  statement: {
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '3px'
  },
  sub: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  }
}));

export default function CustomPieChart(props) {
  const classes = useStyles();
  const { broadCreatorData } = props;
  const creatorsData = useFetchData('/api/dashboard/marketer/report/creators');

  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (d, index) => {
    setActiveIndex(index);
  };

  return (
    <Grid container>
      {(creatorsData.loading) && (
        <Grid item xs={12} className={classes.loading}>
          <Typography className={classes.statement}>
          송출 크리에이터 데이터를 로드하고 있습니다.
          </Typography>
          <Typography className={classes.sub} color="textSecondary">
            접속환경에 따라 수 분이 걸릴 수 있습니다.
          </Typography>
          <div style={{ textAlign: 'center' }}><CircularProgress /></div>
        </Grid>
      )}
      {!creatorsData.loading && broadCreatorData.payload.length === 0 && creatorsData.payload.length === 0 && (
      <Grid
        item
        xs={12}
        style={{
          height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      >
        <div style={{ position: 'absolute' }}>
          <Error style={{ fontSize: 128, opacity: 0.6, zIndex: 0 }} color="secondary" />
        </div>
        <div>
          <Grid container direction="column" justify="center" alignItems="center">
            <Typography style={{ zIndex: 1 }}>
            아직 광고를 송출한 크리에이터가 없어요.
            </Typography>
            <Typography style={{ zIndex: 1 }}>
            배너와 캠페인을 등록해 광고를 집행해보세요.
            </Typography>
          </Grid>
        </div>
      </Grid>
      )}

      <Grid item xs={12} lg={6}>

        {!creatorsData.loading && creatorsData.payload.length > 0 && (
          <ReChartPie
            activeIndex={activeIndex}
            onPieEnter={onPieEnter}
            data={creatorsData.payload.slice(0, 50)}
            height={400}
            nameKey="creatorName"
            dataKey="total_ad_exposure_amount"
            TooltipLabelText="노출"
          />
        )}
      </Grid>

      <Grid item xs={12} lg={6} style={{ overflow: 'hidden' }}>
        {!creatorsData.loading
        && creatorsData.payload.length > 0 && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="caption">* 아이콘 클릭시 해당 크리에이터의 채널로 이동됩니다.</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                * 붉은 점 표시는 현재 배너 송출중 상태를 나타냅니다 (오차가 있을수 있습니다.)
              </Typography>
            </Grid>
              {creatorsData.payload.slice(0, 30).map((d, index) => (
                <Chip
                  key={d.creatorName}
                  variant="outlined"
                  className={classes.chip}
                  label={(
                    <div>
                      {broadCreatorData.payload.includes(d.creatorName) ? (
                        <Badge color="error" badgeContent=" " variant="dot">
                          <Typography variant="body2">{`${index + 1}. ${d.creatorName}`}</Typography>
                        </Badge>
                      ) : (
                        <Typography variant="body2">{`${index + 1}. ${d.creatorName}`}</Typography>
                      )}
                    </div>
                    )}
                  avatar={(
                    <Avatar
                      src={d.creatorLogo}
                    />
                    )}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                  }}
                  onClick={() => { window.open(`https://twitch.tv/${d.creatorTwitchId}`); }}
                />
              ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
