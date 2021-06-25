import * as React from 'react';
import { Divider, Avatar, Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ContentsPie from '../../../marketer/shared/ContentsPie';
import TimeChart from '../../../marketer/shared/TimeChart';
import { CreatorDetailDataInterface } from '../../../marketer/campaign-create2/interfaces';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    minWidth: 600,
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 4,
  },
  flex: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  unit: {
    fontWeight: 700,
    marginLeft: '3px',
  },
  nodetails: {
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipImg: { margin: theme.spacing(0, 0.5) },
}));

interface AnchorInterface {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAnchorClose: () => void;
}

interface CreatorInfoProps {
  anchorEl: AnchorInterface;
  empty: boolean;
  creatorInfo: CreatorDetailDataInterface;
}

export default function CreatorInfo(props: CreatorInfoProps): JSX.Element {
  const classes = useStyles();
  const { anchorEl, creatorInfo, empty } = props;

  const makeValueComponent = ({
    value,
    unit,
  }: {
    value: string | number;
    unit: string;
  }): React.ReactNode => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="h6">
        {value.toLocaleString()}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.unit}>
        {unit}
      </Typography>
    </div>
  );

  const makeNameComponent = ({ value }: { value: string }): React.ReactNode => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
        {value}:
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
            <Avatar src={creatorInfo.creatorLogo} alt="" />
            <Typography gutterBottom variant="h6">
              &emsp;
              {creatorInfo.creatorName || creatorInfo.afreecaName}
              {creatorInfo.afreecaId && (
                <img
                  alt=""
                  height={20}
                  src="/pngs/logo/afreeca/onlyFace.png"
                  className={classes.chipImg}
                />
              )}
              {creatorInfo.creatorTwitchId && (
                <img
                  alt=""
                  height={20}
                  src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                  className={classes.chipImg}
                />
              )}
            </Typography>
          </div>

          <div>
            {creatorInfo.afreecaId && (
              <Button
                variant="outlined"
                onClick={() => window.open(`http://play.afreecatv.com/${creatorInfo.afreecaId}`)}
              >
                <img
                  alt=""
                  height={20}
                  src="/pngs/logo/afreeca/onlyFace.png"
                  className={classes.chipImg}
                />
                방문
              </Button>
            )}
            {creatorInfo.creatorTwitchId && (
              <Button
                variant="outlined"
                onClick={() => window.open(`https://twitch.tv/${creatorInfo.creatorTwitchId}`)}
              >
                <img
                  alt=""
                  height={20}
                  src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                  className={classes.chipImg}
                />
                방문
              </Button>
            )}
          </div>
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
                          {creatorInfo.content || creatorInfo.contentAfreeca}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      {makeNameComponent({ value: '평균 시청자 수' })}
                    </Grid>
                    <Grid item xs={2}>
                      {makeValueComponent({
                        value: creatorInfo.viewer || creatorInfo.viewerAfreeca,
                        unit: '명',
                      })}
                    </Grid>
                  </Grid>
                  <Grid container direction="row" className={classes.flex} spacing={2}>
                    <Grid item xs={3}>
                      {makeNameComponent({ value: '평균 방송 시간' })}
                    </Grid>
                    <Grid item xs={2}>
                      {makeValueComponent({
                        value: creatorInfo.airtime || creatorInfo.airtimeAfreeca,
                        unit: '분',
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      {makeNameComponent({ value: '평균 방송 시간대' })}
                    </Grid>
                    <Grid item xs={3}>
                      {makeValueComponent({
                        value: creatorInfo.openHour || creatorInfo.openHourAfreeca,
                        unit: '',
                      })}
                    </Grid>
                  </Grid>
                  <Grid container direction="row" className={classes.flex} spacing={2}>
                    <Grid item xs={3}>
                      {makeNameComponent({ value: '배너 노출량' })}
                    </Grid>
                    <Grid item xs={2}>
                      {makeValueComponent({
                        value: creatorInfo.impression || creatorInfo.impressionAfreeca,
                        unit: '',
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      {makeNameComponent({ value: '팔로워 수' })}
                    </Grid>
                    <Grid item xs={2}>
                      {makeValueComponent({
                        value: creatorInfo.followers || creatorInfo.followersAfreeca,
                        unit: '명',
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ContentsPie
                selectedChartData={JSON.parse(
                  creatorInfo.contentsGraphData || creatorInfo.contentsGraphDataAfreeca,
                )}
              />
            </Grid>
            <Grid>
              <TimeChart
                selectedChartData={JSON.parse(
                  creatorInfo.timeGraphData || creatorInfo.timeGraphDataAfreeca,
                )}
              />
            </Grid>
          </Grid>
        ) : (
          <div className={classes.nodetails}>
            <Typography variant="body1">해당 방송인은 </Typography>
            <Typography variant="body1">아직 분석할 데이터가 부족합니다.</Typography>
          </div>
        )}
      </div>
    </Popover>
  );
}
