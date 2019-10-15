import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper
} from '@material-ui/core';
import Video from './Video';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import CircularProgress from '../../atoms/Progress/CircularProgress';
import CustomCard from '../../atoms/CustomCard';
import StyledItemText from '../../atoms/StyledItemText';


const useStyles = makeStyles(theme => ({
  video: {
    padding: theme.spacing(2),
    backgroundColor: '#eeeeee'
  },
  container: {
    marginTop: theme.spacing(2)
  }
}));

const NowStreamCard = () => {
  const classes = useStyles();
  const streamData = useFetchData('/api/admin/streams');
  return (
    <CustomCard iconComponent={<StyledItemText primary="현재 방송중인 크리에이터" style={{ color: '#FFF' }} />}>
      <Grid container direction="row" spacing={1} justify="center" className={classes.container}>
        {streamData.loading && (<CircularProgress small />)}
        {!streamData.loading && !streamData.error && (
          streamData.payload.map(creatorTwitchId => (
            <Grid item key={creatorTwitchId}>
              <Paper className={classes.video}>
                <Video creatorTwitchId={creatorTwitchId} />
              </Paper>
            </Grid>
          )))
      }
      </Grid>
    </CustomCard>
  );
};

export default NowStreamCard;
