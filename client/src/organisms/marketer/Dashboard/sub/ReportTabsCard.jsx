import React from 'react';
import { Grid } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import CardHeader from '../../../../atoms/Card/CardHeader';
import Card from '../../../../atoms/Card/Card';
import CardBody from '../../../../atoms/Card/CardBody';

const contents = {
  '전환당 비용': '1',
  '전환율 ': '2',
  '광고 노출 점유율': '3',
  '상호 작용 발생율': '4',
  '상호작용 수': '5',
  '리뷰 수': '6',
  '스트리머 충성도': '7'
};

const ReportTabsCard = (props) => {
  const classes = props;
  return (
    <Grid container>
      {Object.keys(contents).map((value, index) => (
        <Grid item xs={2}>
          <Card>
            <CardBody>
              <span>{value}</span>
              <p style={{ fontSize: '15px', fontWeight: 'bold' }}>{[index]}</p>
            </CardBody>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportTabsCard;
