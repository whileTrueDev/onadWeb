import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import BarChart from '@material-ui/icons/BarChart';
import CustomCard from '../../../atoms/CustomCard';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import PrettoSlider from '../../../atoms/PrettoSlider';
import StyledItemText from '../../../atoms/StyledItemText';
import Tooltip from '../../../atoms/DescPopover';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useTooltip from '../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(({
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
  const {
    tooltipIndex, anchorEl, handleTooltipClose, handleTooltipOpen
  } = useTooltip();


  return (
    <CustomCard
      iconComponent={(<BarChart />)}
      buttonComponent={<StyledItemText primary="광고페이지 현황" secondary="광고페이지의 상호작용에 따라 레벨이 결정됩니다." />}
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
            onMouseEnter={evt => handleTooltipOpen(evt, 2)}
            onMouseLeave={handleTooltipClose}
            aria-owns={anchorEl ? 'send-desc-popover' : undefined}
            aria-haspopup="true"
          >
            <Grid item xs={11} sm={11}>
              <PrettoSlider
                max={500}
                style={{ cursor: 'default' }}
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
          <Grid item>
            <Grid container className={classes.flex}>
              <Grid item>
                <Typography gutterBottom variant="body1" className={classes.head}>총 구매 조회수</Typography>
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
      </Grid>

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="landingManage"
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      />

    </CustomCard>
  );
};

export default IncomeCard;
