import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grow from '@material-ui/core/Grow';
import Button from '../../components/Button';
import ProductHeroLayout from './ProductHeroLayout';

const styles = makeStyles(theme => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 50,
    fontFamily: 'Noto Sans KR',
  },
  loginButtonLeft: {
    color: 'white',
    textAlign: 'left',
    width: '30%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    marginRight: 30,
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      marginTop: 35,
      marginBottom: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
      marginTop: 30,
      marginBottom: 30,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginTop: 20,
      marginBottom: 20,
    },
  },
  maintop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  maintopCenterVideo: {
    width: '750px',
    height: '500px',
    [theme.breakpoints.down('md')]: {
      width: '500px',
      height: '400px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '360px',
      height: '288px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  buttonLeft: {
    width: '40%',
    backgroundColor: '#3154EB',
    borderRadius: '5px',
    fontSize: 16,
    marginRight: 20,
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      padding: '5px 5px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      padding: '5px 5px'
    },
  },
  buttonRight: {
    width: '40%',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    fontSize: 16,
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
      padding: '10px 10px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      padding: '5px 5px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      padding: '8px 8px'
    },
  }
}));

function ProductHero(props) {
  const { source, MainUserType } = props;

  const classes = styles();

  return (
    <ProductHeroLayout MainUserType={MainUserType}>
      {MainUserType === 'marketer' ? (
        <div className={classes.maintop}>
          <div className={classes.loginButtonLeft}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.title}
              </h1>
            </Grow>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.subTitle}
              </h1>
            </Grow>
            <div className={classes.h1sub}>
              {source.text.marketerTail.split('\n').map(row => (
                <p key={row}>{`${row}`}</p>
              ))}
            </div>
            <Button
              className={classes.buttonLeft}
              component={Link}
              to="/introduce/marketer"
            >
              + 자세히보기
            </Button>
            <Button
              className={classes.buttonRight}
              onClick={() => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
            >
              실시간 문의하기
            </Button>
          </div>

          <video className={classes.maintopCenterVideo} autoPlay loop>
            <source src="/video/main/mainMarketer.mp4" type="video/mp4" />
            <track />
          </video>
        </div>
      ) : (
        <div className={classes.maintop}>
          <div className={classes.loginButtonLeft}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.title}
              </h1>
            </Grow>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.subTitle}
              </h1>
            </Grow>
            <div className={classes.h1sub}>
              {source.text.creatorTail.split('\n').map(row => (
                <p key={row}>{`${row}`}</p>
              ))}
            </div>
            <Button
              className={classes.buttonLeft}
              component={Link}
              to="/introduce/creator"
            >
              + 자세히보기
            </Button>
            <Button
              className={classes.buttonRight}
              onClick={() => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
            >
              실시간 문의하기
            </Button>
          </div>

          <video className={classes.maintopCenterVideo} autoPlay loop>
            <source src="/video/main/mainMarketer.mp4" type="video/mp4" />
            <track />
          </video>
        </div>
      )}
    </ProductHeroLayout>
  );
}

export default ProductHero;
