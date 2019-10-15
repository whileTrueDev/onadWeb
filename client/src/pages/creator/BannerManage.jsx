import React from 'react';
import {
  Grid
} from '@material-ui/core';
import BannerTableCard from '../../organisms/creator/BannerManage/BannerTableCard';

const BannerManage = () => (
  <Grid container direction="row">
    <Grid item sm={12} md={10}>
      <BannerTableCard />
    </Grid>
  </Grid>
);

export default BannerManage;
