import React from 'react';
import Countup from 'react-countup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
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
        <div className={classes.container}>
          <Typography variant="h6">
            {data.title}
          </Typography>
        </div>

        <Divider />

        <Grid container justify="center" alignItems="center" style={{ padding: 24 }}>

          <Grid item>
            <Typography variant="h4" color="secondary" align="center">
              <Countup duration={2} end={data.value ? data.value : 0} separator="," />
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
