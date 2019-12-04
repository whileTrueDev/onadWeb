import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16
  }
}));

export default function DescCard(props) {
  const classes = useStyles();
  const { data, ...rest } = props;
  return (
    <Paper {...rest}>

      <div>
        <div style={{ padding: 16 }}>
          <Typography variant="h6">
            {data.title}
          </Typography>
        </div>

        <Divider />

        <Grid container justify="center" alignItems="center" style={{ padding: 24 }}>

          <Grid item>
            <Typography variant="h5" color="primary">
              {`${data.value}`}
            </Typography>

            <Typography variant="body1" align="center">
              {data.unit}
            </Typography>

          </Grid>
        </Grid>
      </div>

    </Paper>
  );
}
