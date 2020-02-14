import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import { Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: grey[100],
    width: '100%',
    height: '400px',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10%'
  },
  wrapper: {
    width: '100%',
    padding: '0px 60px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
    wordBreak: 'keep-all',
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
      textAlign: 'center'
    },
  },
  button: {
    width: 200,
    height: 60,
    fontSize: 20,
    fontFamily: 'Noto sans KR',
    fontWeight: 500,
    color: 'white',
    margin: 20,
    borderRadius: 5,
    wordBreak: 'keep-all',
    backgroundColor: '#3154EB',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: 190,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      width: 140,
      fontSize: 14,
    },
  },
  down: {
    color: 'white'
  },
  subtitle: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
    marginBottom: 30,
    wordBreak: 'keep-all',
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 24,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      textAlign: 'center'
    },
  }
}));

const Indicator = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        서비스에 대해 자세히 알아보세요
      </h2>
      <h3 className={classes.subtitle}>
        지금, 소개자료를 다운받을 수 있습니다.
      </h3>
      <div className={classes.wrapper}>
        <Button
          className={classes.button}
          disabled={loading}
          onClick={() => { handleClick(); }}
        >
          <a href="IntroService/ONAD서비스소개서.pdf" download="ONAD서비스소개서" className={classes.down}>소개자료 다운로드</a>
          {loading && (
            <CircularProgress
              disableShrink
              size={16}
              thickness={5}
              variant="indeterminate"
              className={classes.buttonProgress}
            />
          )}
        </Button>
        <Button
          className={classes.button}
          component={Link}
          to="/introduce/marketer"
        >
          서비스소개 페이지
        </Button>
      </div>
    </div>
  );
};

export default Indicator;
