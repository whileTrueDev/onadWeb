import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Grid, Hidden, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Help from '@material-ui/icons/Help';

//
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Tooltip from '../../../../atoms/DescPopover';

//
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import useTooltip from '../../../../utils/lib/hooks/useTooltip';
//
import ReportTabs from './reportTabs';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: theme.spacing(4)
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  grid: {
    justifyContent: 'center',
  },
}));

const MarketerReport = (props) => {
  const classes = useStyles();
  const { match } = props;

  const reportData = useFetchData('/api/dashboard/marketer/report', {
    campaignId: match.params.campaignId
  });

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  return (
    <Paper className={classes.root}>
      {!reportData.loading
      && reportData.payload && (
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h3">
              <span style={{ color: 'blue' }}>
                {Object.values(reportData.payload[0])}
              </span>
              {' '}
               광고 효과보고서
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Card>
              <CardHeader color="blueGray" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  CPM
                {'  '}
                <Help
                  fontSize="small"
                  color="white"
                  onMouseEnter={evt => handleTooltipOpen(evt, 0)}
                  onMouseLeave={handleTooltipClose}
                  aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                />
              </CardHeader>
              <div className={classes.flex}>
                <Typography gutterBottom variant="h6" className={classes.head}>
                  총 금액
                </Typography>
              </div>
              <div className={classes.flex}>
                <Typography gutterBottom className={classes.cash}>
                  {Object.values(reportData.payload[1])}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
            원
                </Typography>
              </div>

              <Hidden mdDown>
                <Grid container direction="row" spacing={5} className={classes.grid}>
                  <Grid item>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="body1" className={classes.head}>노출 수</Typography>
                    </div>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[2])}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                        명
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Divider component="hr" orientation="vertical" />
                  </Grid>
                  <Grid item>
                    <Grid container className={classes.flex}>
                      <Grid item>
                        <Typography gutterBottom variant="body1" className={classes.head}>노출 시간</Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[3])}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                    분
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Hidden>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card>
              <CardHeader color="blueGray" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  CPC
                {'  '}
                <Help
                  fontSize="small"
                  color="white"
                  onMouseEnter={evt => handleTooltipOpen(evt, 1)}
                  onMouseLeave={handleTooltipClose}
                  aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                />
              </CardHeader>
              <div className={classes.flex}>
                <Typography gutterBottom variant="h6" className={classes.head}>
                  총 금액
                </Typography>
              </div>
              <div className={classes.flex}>
                <Typography gutterBottom className={classes.cash}>
                  {Object.values(reportData.payload[4])}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
            원
                </Typography>
              </div>

              <Hidden mdDown>
                <Grid container direction="row" spacing={5} className={classes.grid}>
                  <Grid item>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="body1" className={classes.head}>
                        클릭 수
                      </Typography>
                    </div>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[5])[0]}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                        회
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Divider component="hr" orientation="vertical" />
                  </Grid>
                  <Grid item>
                    <Grid container className={classes.flex}>
                      <Grid item>
                        <Typography gutterBottom variant="body1" className={classes.head}>
                          홈페이지 방문 수
                        </Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[5])[1]}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                        회
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Hidden>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardHeader color="blueGray" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  TOTAL
              </CardHeader>
              <div className={classes.flex}>
                <Typography gutterBottom variant="h6" className={classes.head}>
                  총 사용 금액
                </Typography>
              </div>
              <div className={classes.flex}>
                <Typography gutterBottom className={classes.cash}>
                  {parseInt(Object.values(reportData.payload[1]), 10) + parseInt(Object.values(reportData.payload[4]), 10)}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
            원
                </Typography>
              </div>

              <Hidden mdDown>
                <Grid container direction="row" spacing={5} className={classes.grid}>
                  <Grid item>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="body1" className={classes.head}>노출 수</Typography>
                    </div>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[2])}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                        명
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Divider component="hr" orientation="vertical" />
                  </Grid>
                  <Grid item>
                    <Grid container className={classes.flex}>
                      <Grid item>
                        <Typography gutterBottom variant="body1" className={classes.head}>노출 시간</Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {Object.values(reportData.payload[3])}
                      </Typography>
                      <Typography gutterBottom variant="body2" className={classes.unit}>
                    분
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Hidden>
            </Card>


          </Grid>
          <ReportTabs />
          <Tooltip
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            handlePopoverClose={handleTooltipClose}
            descIndex={tooltipIndex}
            contentType="reportTooltip"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          />
        </Grid>

      )
      }
    </Paper>

  );
};
export default withStyles(useStyles)(MarketerReport);
