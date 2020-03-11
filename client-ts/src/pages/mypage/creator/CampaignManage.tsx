import React from 'react';
import { Grid } from '@material-ui/core';
import BannerTableCard from '../../../organisms/mypage/creator/CampaignManage/CampaignTableCard';

const CampaignManage = (): JSX.Element => (
  <Grid container direction="row">
    <Grid item sm={12} md={10}>
      <BannerTableCard />
    </Grid>
  </Grid>
);

export default CampaignManage;
