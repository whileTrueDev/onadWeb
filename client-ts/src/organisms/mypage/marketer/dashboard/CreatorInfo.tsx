import React from 'react';
import { Divider, Avatar, Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ContentsPie from '../shared/ContentsPie';
import TimeChart from '../shared/TimeChart';
import { creatorDataInterface, creatorDetailInterface } from './interfaces';

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
    fontWeight: 700,
    marginLeft: '3px'
  },
  nodetails: {
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

interface anchorInterface {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAnchorClose: () => void;
}

interface propInterface {
  anchorEl: anchorInterface;
  empty: boolean;
  creatorInfo: creatorDetailInterface;
}

export default function CreatorInfo(props: propInterface) {
  const classes = useStyles();
  const {
    anchorEl, creatorInfo, empty
  } = props;


  const makeValueComponent = ({ value, unit }: { value: string | number, unit: string }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="h6">
        {value}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
    </div>
  );


  const makeNameComponent = ({ value }: { value: string }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
        {value}
        :
      </Typography>
    </div>
  );


  return (
    <Popover
      open={anchorEl.open}
      anchorEl={anchorEl.anchorEl}
      onClose={anchorEl.handleAnchorClose}
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
              anchorEl.handleAnchorClose();
            }}
          >
            채널 방문
          </Button>
        </div>
        <Divider />
        {!empty ? (
          <Grid container direction="column" style={{ marginTop: 20 }}>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Grid container direction="row" className={classes.flex} spacing={1}>
                    <Grid item xs={2}>
                      {makeNameComponent({ value: '주 컨텐츠' })}
                    </Grid>
                    <Grid item xs={4}>
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
        )
          : (
            <div className={classes.nodetails}>
              <Typography variant="body1">해당 크리에이터는 </Typography>
              <Typography variant="body1">아직 분석할 데이터가 부족합니다.</Typography>
            </div>
          )
        }
      </div>
    </Popover>
  );
}
