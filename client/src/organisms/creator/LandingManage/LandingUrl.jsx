import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  site: {
    color: '#00acc1',
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

export default function LandingUrl(props) {
  const { userData } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body1">내 광고사이트 주소&emsp;</Typography>
      { !userData.loading && userData.payload && (
      <Typography
        className={classes.site}
        variant="body1"
        onClick={() => { window.open(`https://l.onad.io/${userData.payload.creatorTwitchId}`); }}
      >
        {`https://l.onad.io/${userData.payload.creatorTwitchId}`}

      </Typography>
      )}
    </div>
  );
}
