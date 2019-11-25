import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import Card from '../../../../atoms/Card/Card';
import CardBody from '../../../../atoms/Card/CardBody';
import Tooltip from '../../../../atoms/DescPopover';
import useTooltip from '../../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(theme => ({
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
  }
}));

const ReportCard = (props) => {
  const { reportData, period } = props;
  let contents = {
    '전환당 비용': '-',
    '전환율 ': '-',
    '상호 작용 발생율': '-',
    '상호작용 수': '-',
    '광고 노출 점유율': '-',
    // '리뷰 수': '-',
    '스트리머 충성도': '-'
  };

  if (reportData !== undefined) {
    switch (period) {
      case 'norange':
        contents = [
          { title: '전환당 비용', value: (reportData.totalCPM / reportData.totalClick).toFixed(2), unit: '원' },
          { title: '전환율 ', value: ((reportData.totalTransfer / reportData.totalClick) * 100).toFixed(2), unit: '%' },
          { title: '광고 노출 점유율', value: '', unit: '%' },
          { title: '상호 작용 발생율', value: ((reportData.totalClick / reportData.totalViewCount) * 100).toFixed(2), unit: '%' },
          { title: '상호작용 수', value: (reportData.totalClick + reportData.totalTransfer), unit: '회' },
          { title: '리뷰 수', value: '', unit: '회' },
          { title: '스트리머 충성도', value: '', unit: '' },
          { title: '준비중', value: '', unit: '' }
        ];
        break;
      case 14: // week
        contents = [
          { title: '전환당 비용', value: (reportData.weeksCPM / reportData.weeksClick).toFixed(2), unit: '원' },
          { title: '전환율 ', value: ((reportData.weeksTransfer / reportData.weeksClick) * 100).toFixed(2), unit: '%' },
          { title: '광고 노출 점유율', value: '', unit: '%' },
          { title: '상호 작용 발생율', value: ((reportData.weeksClick / reportData.weeksViewCount) * 100).toFixed(2), unit: '%' },
          { title: '상호작용 수', value: (reportData.weeksClick + reportData.weeksTransfer), unit: '회' },
          { title: '리뷰 수', value: '', unit: '회' },
          { title: '스트리머 충성도', value: '', unit: '' },
          { title: '준비중', value: '', unit: '' }
        ];
        break;

      case 30: // months
        contents = [
          { title: '전환당 비용', value: (reportData.monthsCPM / reportData.monthsClick).toFixed(2), unit: '원' },
          { title: '전환율 ', value: ((reportData.monthsTransfer / reportData.monthsClick) * 100).toFixed(2), unit: '%' },
          { title: '광고 노출 점유율', value: '', unit: '%' },
          { title: '상호 작용 발생율', value: ((reportData.monthsClick / reportData.monthsViewCount) * 100).toFixed(2), unit: '%' },
          { title: '상호작용 수', value: (reportData.monthsClick + reportData.monthsTransfer), unit: '회' },
          { title: '리뷰 수', value: '', unit: '회' },
          { title: '스트리머 충성도', value: '', unit: '' },
          { title: '준비중', value: '', unit: '' }
        ];
        break;
      default: // 기본값
        contents = [
          { title: '전환당 비용', value: '', unit: '원' },
          { title: '전환율 ', value: '', unit: '%' },
          { title: '광고 노출 점유율', value: '', unit: '%' },
          { title: '상호 작용 발생율', value: '', unit: '%' },
          { title: '상호작용 수', value: '', unit: '회' },
          { title: '리뷰 수', value: '', unit: '회' },
          { title: '스트리머 충성도', value: '', unit: '' },
          { title: '준비중', value: '', unit: '' }
        ];
        break;
    }
  }

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  const classes = useStyles();

  return (
    <Grid container spacing={3} style={{ marginTop: 20 }}>
      {contents.map((content, index) => (
        <Grid key={content.title} item xs={12} sm={6} md={3}>
          <Card style={{ padding: 0, margin: 0 }}>
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
                <Typography gutterBottom variant="h4" style={{ color: '#00acc1', fontWeight: 700 }}>
                  {content.value === '-' ? (
                    <span>{content.value}</span>
                  ) : (
                    <CountUp duration={1} end={Number(content.value)} />
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
