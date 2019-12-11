import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import Card from '../../../../../../atoms/Card/Card';
import CardBody from '../../../../../../atoms/Card/CardBody';
import Tooltip from '../../../../../../atoms/DescPopover';
import useTooltip from '../../../../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  card: {
    margin: 0, padding: 0
  },
  titleSection: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      marginBottom: 65
    },
  },
  title: {
    fontWeight: 700,
    [theme.breakpoints.only('md')]: {
      fontSize: 16
    }
  },
  value: {
    color: '#00acc1', fontWeight: 700
  }
}));

const ReportCard = (props) => {
  const { reportData, period } = props;
  console.log(reportData);
  let contents = [];

  if (reportData) {
    switch (period) {
      case 'norange':
        contents = [
          {
            title: '전환당 비용',
            value: ((reportData.totalCPM + reportData.totalCPC) / reportData.totalTransfer),
            unit: '원',
            decimalRange: 2
          },
          {
            title: '전환율',
            value: (reportData.totalTransfer / reportData.totalLandingView),
            unit: '%',
            decimalRange: 4
          },
          { title: '상호작용 수', value: (reportData.totalClick + reportData.totalTransfer), unit: '회' },
          {
            title: '상호 작용 발생율',
            value: ((reportData.totalClick + reportData.totalTransfer)
                      / reportData.totalCPM),
            unit: '%',
            decimalRange: 4
          },
          {
            title: '배너조회율',
            value: (reportData.totalClick / reportData.totalCPM),
            unit: '',
            decimalRange: 4
          },
          {
            title: '배너클릭율',
            value: (reportData.totalTransfer / reportData.totalCPM),
            unit: '',
            decimalRange: 4
          },
          { title: '광고 노출 점유율(도입예정)', value: '', unit: '%' },
          { title: '리뷰 수(도입예정)', value: '', unit: '회' },
        ];
        break;
      case 14: // week
        contents = [
          {
            title: '전환당 비용',
            value: ((reportData.weeksCPM + reportData.weeksCPC) / reportData.weeksTransfer),
            unit: '원',
            decimalRange: 2
          },
          {
            title: '전환율',
            value: (reportData.weeksTransfer / reportData.totalLandingView),
            unit: '%',
            decimalRange: 4
          },
          { title: '상호작용 수', value: (reportData.weeksClick + reportData.weeksTransfer), unit: '회' },
          {
            title: '상호 작용 발생율',
            value: ((reportData.weeksClick + reportData.weeksTransfer)
                    / reportData.weeksCPM),
            unit: '%',
            decimalRange: 4
          },
          {
            title: '배너조회율',
            value: (reportData.weeksClick / reportData.weeksCPM),
            unit: '',
            decimalRange: 4
          },
          {
            title: '배너클릭율',
            value: (reportData.weeksTransfer / reportData.weeksCPM),
            unit: '',
            decimalRange: 4
          },
          { title: '광고 노출 점유율(도입예정)', value: '', unit: '%' },
          { title: '리뷰 수(도입예정)', value: '', unit: '회' },
        ];
        break;

      case 30: // months
        contents = [
          {
            title: '전환당 비용',
            value: ((reportData.monthsCPM + reportData.monthsCPC) / reportData.monthsTransfer),
            unit: '원',
            decimalRange: 2
          },
          {
            title: '전환율',
            value: (reportData.monthsTransfer / reportData.totalLandingView),
            unit: '%',
            decimalRange: 4
          },
          { title: '상호작용 수', value: (reportData.monthsClick + reportData.monthsTransfer), unit: '회' },
          {
            title: '상호 작용 발생율',
            value: ((reportData.monthsClick + reportData.monthsTransfer)
                    / reportData.monthsCPM),
            unit: '%',
            decimalRange: 4
          },
          {
            title: '배너조회율',
            value: (reportData.monthsClick / reportData.monthsCPM),
            unit: '',
            decimalRange: 4
          },
          {
            title: '배너클릭율',
            value: (reportData.monthsTransfer / reportData.monthsCPM),
            unit: '',
            decimalRange: 4
          },
          { title: '광고 노출 점유율(도입예정)', value: '', unit: '%' },
          { title: '리뷰 수(도입예정)', value: '', unit: '회' },
        ];
        break;
      default: // 기본값
        contents = [
          {
            title: '전환당 비용', value: '', unit: '원', decimalRange: 2
          },
          {
            title: '전환율', value: '', unit: '%', decimalRange: 4
          },
          { title: '상호작용 수', value: '', unit: '회' },
          {
            title: '상호 작용 발생율', value: '', unit: '%', decimalRange: 4
          },
          {
            title: '배너조회율', value: '', unit: '', decimalRange: 4
          },
          { title: '배너클릭율', value: '', unit: '' },
          { title: '광고 노출 점유율(도입예정)', value: '', unit: '%' },
          { title: '리뷰 수(도입예정)', value: '', unit: '회' },
        ];
        break;
    }
  }

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.container}>

      {contents.map((content, index) => (
        <Grid key={content.title} item xs={12} md={6}>
          <Card className={classes.card}>
            <CardBody>
              <div className={classes.titleSection}>

                <Typography variant="h6" className={classes.title}>
                  {content.title}
                </Typography>

                <Help
                  fontSize="small"
                  color="disabled"
                  onMouseEnter={(evt) => {
                    if (!(content.title === '준비중')) { handleTooltipOpen(evt, index); }
                  }}
                  onMouseLeave={handleTooltipClose}
                  aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                />

              </div>

              <div style={{ display: 'flex' }}>

                <Typography gutterBottom variant="h4" className={classes.value}>
                  {content.value === '-' ? (
                    <span>{content.value}</span>
                  ) : (
                    <CountUp
                      duration={1}
                      end={Number(content.value)}
                      decimals={content.decimalRange}
                    />
                  )}
                </Typography>

                <Typography gutterBottom variant="body2">
                  {content.unit}
                </Typography>

              </div>
            </CardBody>
          </Card>
        </Grid>
      ))}

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="reportCardTooltip"
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
  );
};

export default ReportCard;

ReportCard.propTypes = {
  reportData: PropTypes.object,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
