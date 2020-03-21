import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

export default function ReportLoading(): JSX.Element {
  return (
    <div data-html2canvas-ignore>
      <div style={{ padding: 24 }}>
        <Skeleton height={80} />
      </div>
      <Divider />
      <Grid container spacing={4} style={{ padding: 24 }}>
        <Hidden smDown>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton height={150} />
          </Grid>
        </Hidden>

        <Hidden mdUp>
          <Grid item xs={6}>
            <Skeleton height={120} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton height={120} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton height={120} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton height={120} />
          </Grid>
        </Hidden>

        <Hidden smUp>
          <Grid item xs={12}>
            <Skeleton height={120} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={120} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={120} />
          </Grid>
        </Hidden>
      </Grid>

      <Grid container spacing={4} style={{ padding: 24 }}>
        <Grid item xs={6}>
          <Skeleton height={400} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton height={400} />
        </Grid>
      </Grid>
    </div>
  );
}
