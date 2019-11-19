import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import Tooltip from '../../../atoms/DescPopover';
//
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useTooltip from '../../../utils/lib/hooks/useTooltip';
//
import ReportTabs from './sub/TabsReport';

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
  const [period, setPeriod] = useState(0);
  const [dataSet, setDataSet] = useState();
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
    setPeriod(event.target.value);
    event.preventDefault();
    const dateArray = [];
    if (event.target.value === 0) {
      setDataSet(false);
    } else if (event.target.value === 1) {
      for (let i = 6; i <= 10; i += 1) {
        dateArray.push(reportData.payload[i]);
      }
      setDataSet(dateArray);
    } else if (event.target.value === 2) {
      for (let i = 11; i <= 15; i += 1) {
        dateArray.push(reportData.payload[i]);
      }
      setDataSet(dateArray);
    }
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
                value={period}
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
                  {dataSet ? (dataSet[0])
                    : Object.values(reportData.payload[1])}
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
                        {dataSet ? (dataSet[1])
                          : Object.values(reportData.payload[2])}
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
                        {dataSet ? Math.round(dataSet[2])
                          : Math.round(Object.values(reportData.payload[3]))}
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
                  {dataSet ? (dataSet[3])
                    : Object.values(reportData.payload[4])}
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
                        {dataSet ? (dataSet[4][0])
                          : Object.values(reportData.payload[5])[0]}
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
                        {dataSet ? (dataSet[4][1])
                          : Object.values(reportData.payload[5])[1]}
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
                  {dataSet
                    ? (parseInt(dataSet[0], 10) + parseInt(dataSet[3], 10))
                    : parseInt(Object.values(reportData.payload[1]), 10)
                        + parseInt(Object.values(reportData.payload[4]), 10)}
                </Typography>
                <Typography gutterBottom variant="body2" className={classes.unit}>
                  원
                </Typography>
              </div>
              <Hidden mdDown>
                <Grid container direction="row" spacing={5} className={classes.grid}>
                  <Grid item>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="body1" className={classes.head}>CPM 비율</Typography>
                    </div>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {dataSet
                          ? ((parseInt(dataSet[0], 10) / (parseInt(dataSet[0], 10)
                            + parseInt(dataSet[3], 10))) * 100).toFixed(2)
                          : ((parseInt(Object.values(reportData.payload[1]), 10)
                            / (parseInt(Object.values(reportData.payload[1]), 10)
                            + parseInt(Object.values(reportData.payload[4]), 10))) * 100).toFixed(2)}
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        %
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Divider component="hr" orientation="vertical" />
                  </Grid>
                  <Grid item>
                    <Grid container className={classes.flex}>
                      <Grid item>
                        <Typography gutterBottom variant="body1" className={classes.head}>CPC 비율</Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.flex}>
                      <Typography gutterBottom variant="h5">
                        {dataSet
                          ? ((parseInt(dataSet[3], 10) / (parseInt(dataSet[0], 10)
                              + parseInt(dataSet[3], 10))) * 100).toFixed(2)
                          : ((parseInt(Object.values(reportData.payload[4]), 10)
                              / (parseInt(Object.values(reportData.payload[1]), 10)
                              + parseInt(Object.values(reportData.payload[4]), 10))) * 100).toFixed(2)}
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        %
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
              period={period}
              reportData={reportData}
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
export default MarketerReport;
