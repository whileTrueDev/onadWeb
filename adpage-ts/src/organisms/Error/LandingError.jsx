import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    height: '75vh',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
      fontSize: 10,
    },
  },
  logo: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    width: '30px',
  },
}));

export default function LandingError() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center" className={classes.root}>
      <img src="/images/logo/onad_logo_vertical.png" width="200" alt="logo" />
      <div style={{ marginLeft: 50 }}>
        <Typography variant="h5">죄송합니다. 페이지를 사용할 수 없습니다.</Typography>
        <br />
        <Typography variant="body1">아직 OnAD 랜딩페이지를 이용하지 않는 크리에이터이거나 잘못된 경로일 수 있습니다.</Typography>
        <Typography variant="body1">정상적으로 경로를 입력하였으며 OnAD에 가입된 크리에이터이지만, </Typography>
        <Typography variant="body1">페이지가 올바르게 작동하지 않는다면 support@onad.io로 연락 주시기 바랍니다.</Typography>
      </div>
    </Grid>
  );
}
