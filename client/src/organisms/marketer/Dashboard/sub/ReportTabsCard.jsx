import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Help from '@material-ui/icons/Help';
//
import CardHeader from '../../../../atoms/Card/CardHeader';
import Card from '../../../../atoms/Card/Card';
import CardBody from '../../../../atoms/Card/CardBody';
import Tooltip from '../../../../atoms/DescPopover';

import useTooltip from '../../../../utils/lib/hooks/useTooltip';

const ReportTabsCard = (props) => {
  const { classes, reportData, period } = props;
  let contents = {
    '전환당 비용': '-',
    '전환율 ': '-',
    '광고 노출 점유율': '-',
    '상호 작용 발생율': '-',
    '상호작용 수': '-',
    '리뷰 수': '-',
    '스트리머 충성도': '-'
  };

  if (reportData !== undefined) {
    switch (period) {
      case 0: contents = {
        '전환당 비용': [(reportData.payload[1] / reportData.payload[5][0]).toFixed(2), ' 원'],
        '전환율 ': [((reportData.payload[5][1] / reportData.payload[5][0]) * 100).toFixed(2), ' %'],
        '광고 노출 점유율': '-',
        '상호 작용 발생율': [((reportData.payload[5][0] / reportData.payload[2]) * 100).toFixed(2), ' %'],
        '상호작용 수': [(reportData.payload[5][0]), ' 회'],
        '리뷰 수': '-',
        '스트리머 충성도': '-'
      };
        break;

      case 1: contents = {
        '전환당 비용': [(reportData.payload[6] / reportData.payload[10][0]).toFixed(2), ' 원'],
        '전환율 ': [((reportData.payload[10][1] / reportData.payload[10][0]) * 100).toFixed(2), ' %'],
        '광고 노출 점유율': '-',
        '상호 작용 발생율': [((reportData.payload[10][0] / reportData.payload[7]) * 100).toFixed(2), ' %'],
        '상호작용 수': [(reportData.payload[10][0]), ' 회'],
        '리뷰 수': '-',
        '스트리머 충성도': '-'
      };
        break;

      case 2: contents = {
        '전환당 비용': [(reportData.payload[11] / reportData.payload[15][0]).toFixed(2), ' 원'],
        '전환율 ': [((reportData.payload[15][1] / reportData.payload[15][0]) * 100).toFixed(2), ' %'],
        '광고 노출 점유율': '-',
        '상호 작용 발생율': [((reportData.payload[15][0] / reportData.payload[12]) * 100).toFixed(2), ' %'],
        '상호작용 수': [(reportData.payload[15][0]), ' 회'],
        '리뷰 수': '-',
        '스트리머 충성도': '-'
      };
        break;
      default: contents = {
        '전환당 비용': '-',
        '전환율 ': '-',
        '광고 노출 점유율': '-',
        '상호 작용 발생율': '-',
        '상호작용 수': '-',
        '리뷰 수': '-',
        '스트리머 충성도': '-'
      };
        break;
    }
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
