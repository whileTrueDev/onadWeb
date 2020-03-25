import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    height: '102vh'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(5)
    },
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  linkButton: {
    color: theme.palette.common.white,
    maxWidth: '250px',
    height: '80px',
    textTransform: 'none',
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function NotFound(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.container} item xs={12}>

        <img src="/pngs/logo/onad_logo_vertical_black.png" alt="logo" width="150px" />

        <h2>페이지를 찾을 수 없습니다.</h2>
        <span>방문을 원하시는 페이지의 주소가 잘못되었거나 혹은 </span>
        <span>오류 및 변경, 삭제로 인해 요청하신 페이지를 찾을 수 없습니다.</span>
        <span>문의가 필요하시다면, support@onad.io 로 메일을 보내주세요! 빠른 시일내에 답변드릴게요.</span>
        <br />
        <Button
          className={classes.linkButton}
          variant="contained"
          size="large"
          to="/"
          component={Link}
        >
          OnAD 메인으로 이동

        </Button>
      </Grid>
    </Grid>
  );
}
