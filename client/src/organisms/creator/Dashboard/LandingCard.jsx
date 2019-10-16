import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import BarChart from '@material-ui/icons/BarChart';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../../atoms/CustomCard';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import PrettoSlider from '../../../atoms/PrettoSlider';
import StyledItemText from '../../../atoms/StyledItemText';

const useStyles = makeStyles(({
  stats: {
    color: '#999',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: '500',
    color: '#455a64',
  },
  unit: {
    fontWeight: '700',
    marginLeft: '3px'
  },
  level: {
    fontWeight: '700',
    marginLeft: '3px'
  }
}));

const IncomeCard = () => {
  const classes = useStyles();
  const landingData = useFetchData('/api/dashboard/creator/landing/data');

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
        <Grid item />
        <Grid item />
        <Grid item>
          <Grid
            container
            direction="row"
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid item xs={11} sm={11}>
              <PrettoSlider
                max="500"
                valueLabelDisplay="on"
                aria-label="pretto slider"
                value={!landingData.loading && !landingData.error ? landingData.payload.exp : 0}
              />
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="body2" className={classes.level}>
                LV.
                {landingData.loading && '0'}
                {!landingData.loading && !landingData.error && (
                  landingData.payload.level
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-evenly">
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>총 방문수</Typography>
            </div>
            {landingData.loading && (<CircularProgress small />)}
            {!landingData.loading && !landingData.error && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${landingData.payload.visitCount} `}
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
            {landingData.loading && (<CircularProgress small />)}
            {!landingData.loading && !landingData.error && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${landingData.payload.clickCount} `}
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
          {/* <Grid item>
            <Grid container className={classes.flex}>
              <Grid item>
                <Typography gutterBottom variant="body1" className={classes.head}>반응도</Typography>
              </Grid>
              <Grid item>

                <Help
                  fontSize="small"
                // onMouseEnter={handlePopoverOpen(i)}
                // onMouseLeave={handlePopoverClose}
                // aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                  color="disabled"
                />
              </Grid>
            </Grid>
            {cashData.loading && (<CircularProgress small />)}
            {!cashData.loading && !cashData.error && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${cashData.payload.creatorTotalIncome} `}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                %
                </Typography>
              </div>
            )}
          </Grid> */}
          <Grid item>
            <Grid container className={classes.flex}>
              <Grid item>
                <Typography gutterBottom variant="body1" className={classes.head}>총 구매 조회수</Typography>
              </Grid>
              <Grid item>

                <Help
                  fontSize="small"
                // onMouseEnter={handlePopoverOpen(i)}
                // onMouseLeave={handlePopoverClose}
                // aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                  color="disabled"
                />
              </Grid>
            </Grid>
            {landingData.loading && (<CircularProgress small />)}
            {!landingData.loading && !landingData.error && (
              <div className={classes.flex}>
                <Typography gutterBottom variant="h5">
                  {`${landingData.payload.transferCount} `}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                회
                </Typography>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid item>
          <div
            className={classnames(classes.stats, classes.flex)}
          >
            {!landingData.loading && !landingData.error && landingData.payload.date
                  && (
                  <div>
                    <DateRange />
                    <span>{`업데이트 : ${landingData.payload.date}`}</span>
                  </div>
                  )}
          </div>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default IncomeCard;
