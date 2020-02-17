import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    '&>*': {
      transition: 'width 1s ease',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
    [theme.breakpoints.down('xs')]: {
    },
  },
  advertiser: {
    width: '45%',
    background: '#0D93BF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      '&:hover': {
        width: '60%',
        '&>#advertiserContent': {
          transition: 'boxShadow 1.5s ease',
          boxShadow: '0px 0px 30px 15px rgba(255, 255, 255, 0.4)'
        }
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '50%',
      '&:hover': {
        width: '100%',
        '&>#advertiserContent': {
          boxShadow: 'none',
        }
      }
    },
  },
  linear: {
    width: '0px',
    borderRight: '20vh solid transparent',
    borderBottom: '100vh solid #0D93BF',
    position: 'relative',
    left: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  creator: {
    background: 'url(\'/pngs/main/creatorDoor.png\') no-repeat center center',
    width: '55%',
    '&:hover': {
      width: '70%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '50%',
      '&:hover': {
        width: '100%',
      }
    },
  },
  creatorWrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    [theme.breakpoints.up('sm')]: {
      '&:hover': {
        '&>#creatorContent': {
          transition: 'boxShadow 1.5s ease',
          boxShadow: '0px 0px 30px 15px rgba(255, 255, 255, 0.4)',
        }
      },
    },
    [theme.breakpoints.down('sm')]: {
      '&:hover': {
        '&>#creatorContent': {
          boxShadow: 'none',
        }
      },
    },
  },
  logo: {
    width: '100%',
    top: 0,
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
  },
  doorlogo: {
    width: '130px',
    height: '30px',
    padding: '30px 20px',
    [theme.breakpoints.down('md')]: {
      width: '110px',
      height: '25px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
      height: '23px',
    },
  },
  advertiserContent: {
    width: 500,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    boxShadow: '0px 0px 20px 1px rgba(255, 255, 255, 0.4)',
    [theme.breakpoints.down('md')]: {
      width: 350,
      height: 350,
    },
    [theme.breakpoints.down('sm')]: {
      width: 300,
      height: 'auto',
      border: 'none',
      boxShadow: 'none'
    },
  },
  creatorContent: {
    width: 500,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto',
    justifyContent: 'center',
    borderRadius: '50%',
    boxShadow: '0px 0px 20px 1px rgba(255, 255, 255, 0.4)',
    [theme.breakpoints.down('md')]: {
      width: 350,
      height: 350,
    },
    [theme.breakpoints.down('sm')]: {
      width: 300,
      height: 'auto',
      border: 'none',
      boxShadow: 'none',
    },
  },
  fontStyle: {
    fontFamily: 'Noto Sans KR',
    color: 'white',
    fontSize: 30,
    margin: 25,
    [theme.breakpoints.down('md')]: {
      fontSize: 25,
      margin: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      margin: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      margin: 10,
      display: 'none'
    },
  },
  fontStyle2: {
    margin: 0,
    fontFamily: 'Noto Sans KR',
    color: 'white',
    fontSize: 25,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  fontStyle3: {
    fontFamily: 'S-CoreDream-8Heavy',
    color: 'white',
    margin: 0,
    fontSize: 35,
    [theme.breakpoints.down('md')]: {
      fontSize: 28,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 23,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  linkStyle: {
    fontFamily: 'Noto Sans KR',
    color: 'white',
    borderRadius: '5px',
    border: '1px solid white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 30,
    fontSize: 20,
    padding: '15px 20px',
    [theme.breakpoints.down('md')]: {
      marginTop: 20,
      fontSize: 17,
      padding: '10px 15px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
      fontSize: 13,
      padding: '8px 12px',
    },
  },
  corp: {
    width: '100%',
    padding: '20px 20px',
    position: 'fixed',
    fontFamily: 'Noto Sans KR',
    color: 'white',
    fontSize: 20,
    bottom: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  icon: {
    width: '70px',
    height: '70px',
    [theme.breakpoints.down('md')]: {
      width: '50px',
      height: '50px',
    },
  }
}));

const Door = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.logo}>
        <div style={{ padding: '20px' }}>
          <p className={classes.fontStyle} style={{ fontSize: '20px' }}><strong>실시간 광고매칭 플랫폼 : 온애드</strong></p>
        </div>
        <img src="/pngs/main/doorlogo.png" alt="logo" className={classes.doorlogo} />
      </div>
      <div className={classes.advertiser}>
        <div className={classes.advertiserContent} id="advertiserContent">
          <img src="/pngs/main/main_client.png" alt="client" className={classes.icon} />
          <h1 className={classes.fontStyle3}><strong>CLIENT</strong></h1>
          <h1 className={classes.fontStyle}><strong>광고주페이지입니다!</strong></h1>
          <h3 className={classes.fontStyle2}>1인 미디어 컨텐츠 속 광고,</h3>
          <h3 className={classes.fontStyle2}>복잡한 절차없이 배너만 등록하세요</h3>
          <a href="/marketer" className={classes.linkStyle}>바로가기</a>
        </div>
      </div>
      <div className={classes.creator}>
        <div className={classes.creatorWrap}>
          <div className={classes.linear} />
          <div className={classes.creatorContent} id="creatorContent">
            <img src="/pngs/main/main_creator.png" alt="creator" className={classes.icon} />
            <h1 className={classes.fontStyle3}><strong>CREATOR</strong></h1>
            <h1 className={classes.fontStyle}><strong>크리에이터페이지입니다!</strong></h1>
            <h3 className={classes.fontStyle2}>1인 미디어 광고 매칭 파트너</h3>
            <h3 className={classes.fontStyle2}>온애드입니다</h3>
            <a href="/creator" className={classes.linkStyle}>바로가기</a>
          </div>
        </div>
      </div>
      <div className={classes.corp}>
        &copy; while True Corp.
      </div>
    </div>
  );
};

export default Door;
