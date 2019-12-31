import React from 'react';
import { Divider, Avatar, Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ContentsPie from './ContentsPie';
import TimeChart from './TimeChart';

const useStyles = makeStyles(() => ({
  container: {
    padding: 12, minWidth: 600
  },
  spaceBetween: {
    display: 'flex', justifyContent: 'space-between', padding: 4
  },
  flex: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },
  unit: {
    fontWeight: '700',
    marginLeft: '3px'
  },

}));

export default function CreatorInfo(props) {
  const classes = useStyles();
  const { anchorEl, handleClose, creatorInfo } = props;


  const makeValueComponent = ({ value, unit }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="h6">
        {value}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
    </div>
  );


  const makeNameComponent = ({ value }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
        {value}
        :
      </Typography>
    </div>
  );


  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <div className={classes.container}>
        <div className={classes.spaceBetween}>
          <div className={classes.flex}>
            <Avatar
              src={creatorInfo.creatorLogo}
              alt=""
            />
            <Typography gutterBottom variant="h6">
              &emsp;
              {creatorInfo.creatorName}
            </Typography>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.open(`https://twitch.tv/${creatorInfo.creatorTwitchId}`);
              handleClose();
            }}
          >
            채널 방문
          </Button>
        </div>
        <Divider />
        <Grid container direction="column" style={{ marginTop: 20 }}>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Grid container direction="row" className={classes.flex} spacing={1}>
                  <Grid item xs={2}>
                    {makeNameComponent({ value: '주 컨텐츠' })}
                  </Grid>
                  <Grid item xs={4}>
                    {/* {makeValueComponent({ value: creatorInfo.content, unit: '' })} */}
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="body1">
                        {creatorInfo.content}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    {makeNameComponent({ value: '평균 시청자 수' })}
                  </Grid>
                  <Grid item xs={2}>
                    {makeValueComponent({ value: creatorInfo.viewer, unit: '명' })}
                  </Grid>
                </Grid>
                <Grid container direction="row" className={classes.flex} spacing={2}>
                  <Grid item xs={3}>
                    {makeNameComponent({ value: '평균 방송 시간' })}
                  </Grid>
                  <Grid item xs={2}>
                    {makeValueComponent({ value: creatorInfo.airtime, unit: '분' })}
                  </Grid>
                  <Grid item xs={3}>
                    {makeNameComponent({ value: '평균 방송 시간대' })}
                  </Grid>
                  <Grid item xs={3}>
                    {makeValueComponent({ value: creatorInfo.openHour, unit: '' })}
                  </Grid>
                </Grid>
                <Grid container direction="row" className={classes.flex} spacing={2}>
                  <Grid item xs={3}>
                    {makeNameComponent({ value: '배너 노출량' })}
                  </Grid>
                  <Grid item xs={2}>
                    {makeValueComponent({ value: creatorInfo.impression, unit: '' })}
                  </Grid>
                  <Grid item xs={3}>
                    {makeNameComponent({ value: '팔로워 수' })}
                  </Grid>
                  <Grid item xs={2}>
                    {makeValueComponent({ value: creatorInfo.followers, unit: '명' })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ContentsPie selectedChartData={creatorInfo.contentsGraphData} />
          </Grid>
          <Grid>
            <TimeChart selectedChartData={creatorInfo.timeGraphData} />
          </Grid>
        </Grid>
      </div>
    </Popover>
  );
}
