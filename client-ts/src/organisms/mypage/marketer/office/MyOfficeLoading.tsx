import React from 'react';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

export default function MyOfficeLoading() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={3}>
        <Skeleton variant="rect" height={550} />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={6} xl={3}>
        <Skeleton variant="rect" height={200} />
        <br />
        <Skeleton variant="rect" height={200} />
      </Grid>

    </Grid>
  );
}
