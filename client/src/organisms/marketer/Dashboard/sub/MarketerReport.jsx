import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Grid, Hidden, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Help from '@material-ui/icons/Help';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
//
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Tooltip from '../../../../atoms/DescPopover';
//
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import useTooltip from '../../../../utils/lib/hooks/useTooltip';
import axios from '../../../../utils/axios';
import HOST from '../../../../utils/config';
import history from '../../../../history';

//
import ReportTabs from './ReportTabs';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const MarketerReport = (props) => {
  const classes = useStyles();
  const { match } = props;
  const [date, setDate] = useState(0);
  const [payload, setPayload] = useState(null);

  const reportData = useFetchData('/api/dashboard/marketer/report', {
    campaignId: match.params.campaignId,
  });
  const valueChartData = useFetchData('/api/dashboard/marketer/report/totalSpendChart', {
    campaignId: match.params.campaignId,
  });

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  const handleChange = (event) => {
    setDate(event.target.value);
    console.log('handjle');
    event.preventDefault();
    axios.get(`${HOST}/api/dashboard/marketer/report/totalSpendChart`, {
      params:
      { campaignId: match.params.campaignId, period: event.target.value }
    })
      .then((res) => {
        if (res.data) {
          setPayload(res.data);
          history.push(`/dashboard/marketer/report/${match.params.campaignId}`);
        } else {
          throw new Error('데이터가 존재하지 않습니다');
        }
      }).catch((err) => {
        alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요');
        console.log(`데이터가 없습니다. / ${err}`);
      });
  };

  return (
    <Paper className={classes.root}>
      {!reportData.loading
      && reportData.payload && !valueChartData.loading && valueChartData.payload && (
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
          <Grid item xs={12} />
          <Grid item xs={4}>
            <FormControl className={classes.formControl}>
              <InputLabel>기간</InputLabel>
              <Select
                value={date}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value={0}>전체</MenuItem>
                <MenuItem value={1}>최근 2주</MenuItem>
                <MenuItem value={2}>최근 한 달</MenuItem>
              </Select>
              <FormHelperText>기간을 선택하세요</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} />
          <Grid item xs={4}>
            <Card>
              <CardHeader color="blueGray" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  CPM
                {'  '}
                <Help
                  fontSize="small"
                  color="inherit"
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
                  color="inherit"
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
                        시간
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Hidden>
            </Card>


          </Grid>
          <Grid item xs={12}>
            <ReportTabs
              valueChartData={valueChartData}
            />
          </Grid>
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
