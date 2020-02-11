import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, useScrollTrigger } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    backgroundColor: 'white',
    padding: '0 5%',
  },
  loginButtonRight: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  loginButtonRight2: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  exBanner: {
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    width: '600px',
    height: '420px',
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
  exBanner2: {
    width: '1200px',
    height: 250,
    [theme.breakpoints.down('md')]: {
      width: '900px',
      height: '190px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '550px',
      height: '110px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    wordBreak: 'keep-all',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      fontSize: '20px',
    },
    color: '#0D93BF',
    fontFamily: 'Noto Sans KR',
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
    },
    [theme.breakpoints.down('xs')]: {
      // display: 'grid',
      // gridTemplateColumns: 'repeat(4, 110px)',
      // gridTemplateRows: 'repeat(2, 250px)'
    },
  },
  mainMiddle2: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 80,
    [theme.breakpoints.down('sm')]: {
    },
    [theme.breakpoints.down('xs')]: {
      // display: 'grid',
      // gridTemplateColumns: 'repeat(4, 110px)',
      // gridTemplateRows: 'repeat(2, 250px)'
    },
  },
  costContent: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  costCardWrapper: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  costCardTitle: {
    marginTop: 0,
    marginBottom: 15,
    fontSize: 30,
    fontFamily: 'Noto Sans KR',
    fontWeight: 550,
    [theme.breakpoints.down('md')]: {
      fontSize: 25
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    },
  },
  costCardCon: {
    margin: '5px',
    fontSize: 20,
    fontFamily: 'Noto Sans KR',
    fontWeight: 550,
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    },
  },
  subAdtitle: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: '20px',
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 600
  },
  costContent2: {
    width: '100%',
  },
  subAdtitle2: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: '20px',
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },

  },
  subAdSub: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: 'red'
  },
  subAdSub2: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#3154EB'
  },
  costCard: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    marginTop: 30,
    marginBottom: 30,
    borderRadius: '15px',
    textAlign: 'left'
  },
  costCard2: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: '15px',
    textAlign: 'left',
    marginRight: 30,
    [theme.breakpoints.down('xs')]: {
      width: '85%',
    },
  },
  titleSub: {
    color: '#3154EB',
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    fontWeight: 600,
  },
  textWrapper: {
    width: 1200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    [theme.breakpoints.down('md')]: {
      width: '900px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '550px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  text: {
    margin: 5,
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    fontWeight: 550,
    textAlign: 'center',
  },
}));

export default function IntroduceTop() {
  const classes = useStyles();
  const trigger = useScrollTrigger({ threshold: 850, disableHysteresis: true });
  const trigger2 = useScrollTrigger({ threshold: 1650, disableHysteresis: true });

  return (
    <div className={classes.root}>
      {/* 장점 첫번째 */}
      <div className={classes.mainMiddle}>
        <div className={classes.costContent}>
          <p className={classes.subAdtitle}>크리에이터 배너광고</p>
          <h1 className={classes.h1}>
            배너광고(CPM)
          </h1>
          <p className={classes.subAdtitle2}>생방송 화면에 노출되는 배너를 송출하여 상품 및 브래드의 인지도를 높이는 광고입니다.</p>
          <div className={classes.costCard}>
            <h3 className={classes.costCardTitle}>광고형식</h3>
            <p className={classes.costCardCon}>GIF, JPG, PNG 형식을 지원합니다.</p>
            <p className={classes.costCardCon}>배너사이즈 1920X1080(px) 기준 배너크기 320X160(px)</p>
          </div>
          <div className={classes.costCard}>
            <h3 className={classes.costCardTitle}>
              과금기준&nbsp;
              <span className={classes.titleSub}>(*시간대에 따라 변동될 수 있습니다.)</span>
            </h3>
            <p className={classes.costCardCon}>시청자 수(1명) X 방송시간(10분) X 2원</p>
            <p className={classes.costCardCon}>2000cpm(1,000회 노출당 비용 = 2,000원/1,000원)</p>
          </div>
        </div>
        <div className={classes.loginButtonRight}>
          <Grow in={trigger} timeout={1000}>
            <img src="/pngs/introduction/exCPM.png" alt="exCPM" className={classes.exBanner} />
          </Grow>
        </div>
      </div>

      {/* 장점 두번째 */}
      <div className={classes.mainMiddle2}>
        <div className={classes.costContent2}>
          <p className={classes.subAdtitle}>배너광고에서 클릭까지</p>
          <h1 className={classes.h1}>
            광고페이지(CPC)
          </h1>
          <p className={classes.subAdtitle2}>랜딩 페이지(예: 회사 홈페이지, 쇼핑몰)로의 유입을 원하는 광고주를 위한 형태</p>
          <div className={classes.costCardWrapper}>
            <div className={classes.costCard2}>
              <h3 className={classes.costCardTitle}>광고형식</h3>
              <p className={classes.costCardCon}>개인방송 플랫폼 하단 링크를 동해 광고페이지로 이동</p>
            </div>
            <div className={classes.costCard2}>
              <h3 className={classes.costCardTitle}>
                과금기준
              </h3>
              <p className={classes.costCardCon}>100 CPC (클릭당 비용 = 100원/1회 클릭)</p>
            </div>
          </div>
        </div>
        <div className={classes.loginButtonRight2}>
          <Grow in={trigger2} timeout={1000}>
            <img src="/pngs/introduction/exCPC.png" alt="exCPC" className={classes.exBanner2} />
          </Grow>
          <Grow in={trigger2} timeout={1200}>
            <div className={classes.textWrapper}>
              <div className={classes.texBox}>
                <p className={classes.text}>1. 크리에이터가 개인방송 플랫폼(채널)에</p>
                <p className={classes.text}>개인 랜딩페이지링크 업로드</p>
              </div>
              <div className={classes.texBox2}>
                <p className={classes.text}>2. 실시간 방송 광고 배너를 본 시청자가</p>
                <p className={classes.text}>링크를 클릭해 개인 랜딩페이지로 이동</p>
              </div>
              <div className={classes.texBox3}>
                <p className={classes.text}>3. 관심있는 광고 배너를 클릭 후</p>
                <p className={classes.text}>랜딩페이지로 이동(CPC발생)</p>
              </div>
            </div>
          </Grow>
        </div>
      </div>
    </div>
  );
}
