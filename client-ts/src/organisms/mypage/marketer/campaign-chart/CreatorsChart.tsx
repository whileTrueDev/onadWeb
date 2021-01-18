import React from 'react';
import {
  Grid, Avatar, Chip, Typography, CircularProgress
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import Skeleton from '@material-ui/lab/Skeleton';
import Error from '@material-ui/icons/Error';
import ReChartPie from '../../../../atoms/Chart/ReChartPie';

// usehook
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { CreatorDataInterface } from '../dashboard/interfaces';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5)
  },
  chipImg: { margin: theme.spacing(0, 0.5) },
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


export default function CustomPieChart(): JSX.Element {
  const classes = useStyles();
  const creatorsData = useGetRequest<{ campaignId: string }, CreatorDataInterface[] | null>(
    '/marketer/campaign/analysis/creator-data', { campaignId: '' }
  );

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onPieEnter = (d: CreatorDataInterface, index: number): void => {
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
      {!creatorsData.loading
      && creatorsData.data
      && creatorsData.data.length === 0 && (
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

        {!creatorsData.loading
        && creatorsData.data
        && creatorsData.data.length > 0 && (
          <ReChartPie
            activeIndex={activeIndex}
            onPieEnter={onPieEnter}
            data={creatorsData.data.slice(0, 30)}
            height={400}
            nameKey="creatorName"
            dataKey="total_ad_exposure_amount"
            tooltipLabelText="노출"
          />
        )}
      </Grid>

      <Grid item xs={12} lg={6} style={{ overflow: 'hidden' }}>
        {!creatorsData.loading && creatorsData.data
          && creatorsData.data.length > 0 && (
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="caption">* 아이콘 클릭시 해당 크리에이터의 채널로 이동됩니다.</Typography>
              </Grid>
              {creatorsData.data.slice(0, 20).map((d: CreatorDataInterface, index: number) => (
                <Chip
                  key={d.creatorId}
                  variant="outlined"
                  className={classes.chip}
                  label={(
                    <Typography variant="body2">
                      {`${index + 1}. ${d.creatorName || d.afreecaName}`}
                      {d.afreecaId && (
                      <img
                        alt=""
                        height={10}
                        src="/pngs/logo/afreeca/onlyFace.png"
                        className={classes.chipImg}
                      />
                      )}
                      {d.creatorTwitchId && (
                      <img
                        alt=""
                        height={10}
                        src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                        className={classes.chipImg}
                      />
                      )}
                    </Typography>
                  )}
                  avatar={(
                    <Avatar src={d.creatorLogo || d.afreecaLogo} />
                  )}
                  onMouseEnter={(): void => {
                    setActiveIndex(index);
                  }}
                  onClick={(): void => {
                    if (d.creatorTwitchId) {
                      window.open(`https://twitch.tv/${d.creatorTwitchId}`);
                    } else if (d.afreecaId) {
                      window.open(`http://play.afreecatv.com/${d.afreecaId}`);
                    }
                  }}
                />
              ))}
            </Grid>
        )}
      </Grid>
    </Grid>
  );
}
