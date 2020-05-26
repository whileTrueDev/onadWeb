import React from 'react';
import { Typography, Divider } from '@material-ui/core';

import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import Button from '../../../../atoms/CustomButtons/Button';

// types
import { AdPickData } from './AdpickTypes';


interface CPACampaignsProps {
  campaigns: AdPickData[];
}
export default function CPACampaigns({
  campaigns
}: CPACampaignsProps): JSX.Element {
  return (
    <GridContainer>
      {campaigns.map((item) => (
        <GridItem key={item.apAppTitle} xs={12} md={4} lg={3} xl={3}>
          <Card style={{ display: 'block' }}>

            <div style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <img src={item.apImages?.icon} alt="" height="100" width="100" />

              <Typography style={{
                fontWeight: 800,
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
              >
                {item.apAppTitle}
              </Typography>
              {item.apDailyCap === '0' || item.apDailyCap === 0 ? (
                <Typography variant="caption">{`오늘 ${item.apRemain} / ${item.apDailyCap}`}</Typography>
              ) : (
                <Typography variant="caption">{`남은 횟수 ${item.apRemain}`}</Typography>
              )}
              <Typography color="primary" variant="h6" style={{ fontWeight: 'bold' }}>
                {item.apPayout}
              </Typography>
            </div>
            <Divider />
            <div style={{ padding: '0px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button>미정산 조건</Button>
              <Button color="primary">진행</Button>
            </div>
          </Card>
        </GridItem>
      ))}
    </GridContainer>

  );
}
