import React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Skeleton from '@material-ui/lab/Skeleton';

export default function CampaignLoading(): JSX.Element {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={70} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <Skeleton variant="rect" height={400} />
        </Grid>
        <Hidden mdDown>
          <Grid item lg={9}>
            <Skeleton variant="rect" height={400} />
          </Grid>
          <Grid item lg={3}>
            <Skeleton variant="rect" height={400} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}
