// material-UI
import { Grid, Typography } from '@material-ui/core';
// 내부 소스
import sources from '../../../source/clientMainSource';
// 프로젝트 내부 모듈
import Countup from 'react-countup';
import classNames from 'classnames';
// 컴포넌트
// util 계열
// 스타일
import useStyles from '../../../styles/main/indicator/indicator.style';



interface IndicatorProps {
  nowBroadcast: number;
  bannerView: number;
  contractedCreator: number;
  totalFollower: number;
}

function indicatorDecorate(indicator: number): number {
  const indicatorScore = Math.round(indicator)
  const indicatorLength = String(indicatorScore).length;
  if (indicatorLength < 4) {
    return indicator;
  }
  if (indicatorLength < 7) {
    return Number(String(indicatorScore).slice(0, -3));
  }
  if (indicatorLength < 10) {
    return Number(String(indicatorScore).slice(0, -6));
  }
  return indicator;
}

function indicatorUnit(indicator: number): string {
  const indicatorScore = Math.round(indicator)
  const indicatorLength = String(indicatorScore).length;
  if (indicatorLength < 4) {
    return '';
  }
  if (indicatorLength < 7) {
    return 'K';
  }
  if (indicatorLength < 10) {
    return 'M';
  }
  return '';
}

function Indicator({
  nowBroadcast,
  bannerView,
  contractedCreator,
  totalFollower,
}: IndicatorProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item>
          <div className={classes.contentWrapper}>
            <div className={classNames(classes.content, classes.box1)}>
              <Typography variant="subtitle1" align="center" className={classes.text}>
                {sources.indicator.text.totalFollower}
              </Typography>
              <>
                <Typography variant="h4" align="center" className={classes.count}>
                  <Countup duration={2} end={indicatorDecorate(totalFollower)} />
                  {indicatorUnit(totalFollower)}
                </Typography>
              </>
            </div>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.contentWrapper}>
            <div className={classNames(classes.content, classes.box2)}>
              <Typography variant="subtitle1" align="center" className={classes.text}>
                {sources.indicator.text.contractedCreator}
              </Typography>
              <>
                <Typography variant="h4" align="center" display="inline" className={classes.count}>
                  <Countup duration={2} end={indicatorDecorate(contractedCreator)} />
                  {indicatorUnit(contractedCreator)}
                </Typography>
              </>
            </div>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.contentWrapper}>
            <div className={classNames(classes.content, classes.box3)}>
              <Typography variant="subtitle1" align="center" className={classes.text}>
                {sources.indicator.text.nowBroadcast}
              </Typography>
              <Typography variant="h4" align="center" display="inline" className={classes.count}>
                <Countup duration={2} end={indicatorDecorate(nowBroadcast)} />
              </Typography>
              <Typography variant="h4" align="center" display="inline" className={classes.count}>
                {indicatorUnit(nowBroadcast)}
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.contentWrapper}>
            <div className={classNames(classes.content, classes.box4)}>
              <Typography variant="subtitle1" align="center" className={classes.text}>
                {sources.indicator.text.totalView}
              </Typography>
              <>
                <Typography variant="h4" align="center" display="inline" className={classes.count}>
                  <Countup duration={2} end={indicatorDecorate(bannerView)} />
                  {indicatorUnit(bannerView)}
                </Typography>
              </>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Indicator;
