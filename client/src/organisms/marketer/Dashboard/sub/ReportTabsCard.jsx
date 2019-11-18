import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Help from '@material-ui/icons/Help';


import CardHeader from '../../../../atoms/Card/CardHeader';
import Card from '../../../../atoms/Card/Card';
import CardBody from '../../../../atoms/Card/CardBody';
import Tooltip from '../../../../atoms/DescPopover';

import useTooltip from '../../../../utils/lib/hooks/useTooltip';

const ReportTabsCard = (props) => {
  const { classes, reportData, period } = props;
  const [reportDataState, setReportDataState] = useState('-');
  let contents = {
    '전환당 비용': reportDataState,
    '전환율 ': reportDataState,
    '광고 노출 점유율': reportDataState,
    '상호 작용 발생율': reportDataState,
    '상호작용 수': reportDataState,
    '리뷰 수': reportDataState,
    '스트리머 충성도': reportDataState
  };

  if (reportData !== undefined) {
    switch (period) {
      case 0: contents = {
        '전환당 비용': (reportData.payload[1] / reportData.payload[5][1]).toFixed(2),
        '전환율 ': '2',
        '광고 노출 점유율': '3',
        '상호 작용 발생율': '4',
        '상호작용 수': '5',
        '리뷰 수': '6',
        '스트리머 충성도': '7'
      };
        break;
      case 1: contents = {
        '전환당 비용': (reportData.payload[2] / reportData.payload[5][1]).toFixed(2),
        '전환율 ': '2',
        '광고 노출 점유율': '3',
        '상호 작용 발생율': '4',
        '상호작용 수': '5',
        '리뷰 수': '6',
        '스트리머 충성도': '7'
      };
        break;
      default: contents = {
        '전환당 비용': '2',
        '전환율 ': '2',
        '광고 노출 점유율': '3',
        '상호 작용 발생율': '4',
        '상호작용 수': '5',
        '리뷰 수': '6',
        '스트리머 충성도': '7'
      };
        break;
    }
    console.log(reportData);
    // setReportDataState(reportData);
  }

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  return (
    <Grid container spacing={4}>
      {Object.keys(contents).map((value, index) => (
        <Grid item xs={3}>
          <Card>
            <CardBody>
              <span>{value}</span>
              <Help
                fontSize="small"
                color="inherit"
                onMouseEnter={evt => handleTooltipOpen(evt, index)}
                onMouseLeave={handleTooltipClose}
                aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                aria-haspopup="true"
              />
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{contents[value]}</p>
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

export default ReportTabsCard;
