import React from 'react';
import {
  Grid
} from '@material-ui/core';
import NowBannerCard from '../../organisms/admin/NowBannerCard';
import NowStreamCard from '../../organisms/admin/NowStreamCard';

const Moniter = () => (
  <Grid container direction="row">
    <Grid item sm={12}>
      <NowStreamCard />
    </Grid>
    <Grid item xs={12}>
      <NowBannerCard />
    </Grid>
    <Grid item xs={12} sm={1} xl={2} />
  </Grid>
);

export default Moniter;
