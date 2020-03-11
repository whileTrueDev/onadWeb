import React from 'react';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
// components
import CustomCard from '../../../../atoms/CustomCard';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import PrettoSlider from '../../../../atoms/PrettoSlider';
import StyledItemText from '../../../../atoms/StyledItemText';
// style
import useLandingCardStyles from './LandingCard.style';
// utils
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import numFormatter from '../../../../utils/numFormatter';

interface AdPageRes {
  exp: number;
  level: number;
  visitCount: number;
  clickCount: number;
  transferCount: number;
  date: string;
}

const IncomeCard = (): JSX.Element => {
  const classes = useLandingCardStyles();
  const adPageGet = useGetRequest<null, AdPageRes>('/creator/ad-page');

  return (
    <CustomCard
      iconComponent={<BarChart />}
      buttonComponent={(
        <StyledItemText
          primary="광고페이지 현황"
          secondary="다음 보상까지 남은 경험치입니다."
        />
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item style={{ paddingTop: 32 }}>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={12}>
              {!adPageGet.loading && !adPageGet.error && adPageGet.data && (
              <Typography variant="body2" align="center" className={classes.level}>
                LV.
                {' '}
                {adPageGet.data.level}
              </Typography>
              )}
              <PrettoSlider
                style={{ cursor: 'default' }}
                max={500}
                valueLabelDisplay="on"
                aria-label="pretto slider"
                value={!adPageGet.loading && !adPageGet.error && adPageGet.data
                  ? adPageGet.data.exp : 0}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="space-evenly">
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>총 방문수</Typography>
            </div>
            {adPageGet.loading && (<CircularProgress small />)}
            {!adPageGet.loading && !adPageGet.error && adPageGet.data && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${numFormatter(adPageGet.data.visitCount)} `}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                  회
                </Typography>
              </div>
            )}
          </Grid>
          <Grid item>
            <Divider component="hr" orientation="vertical" />
          </Grid>
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>총 배너 클릭수</Typography>
            </div>
            {adPageGet.loading && (<CircularProgress small />)}
            {!adPageGet.loading && !adPageGet.error && adPageGet.data && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${numFormatter(adPageGet.data.clickCount)} `}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                  회
                </Typography>
              </div>
            )}
          </Grid>
          <Grid item>
            <Divider component="hr" orientation="vertical" />
          </Grid>
          <Grid item>
            <Grid container className={classes.flex}>
              <Grid item>
                <Typography gutterBottom variant="body1" className={classes.head}>총 구매 이동수</Typography>
              </Grid>
            </Grid>
            {adPageGet.loading && (<CircularProgress small />)}
            {!adPageGet.loading && !adPageGet.error && adPageGet.data && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${numFormatter(adPageGet.data.transferCount)} `}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                  회
                </Typography>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default IncomeCard;
