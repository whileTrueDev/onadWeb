import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useScrollTrigger } from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
  },
  loginButtonRight: {
    color: 'black',
    textAlign: 'left',
    width: '20%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    marginLeft: 40,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      marginLeft: 0,
      textAlign: 'left',
    },
    [theme.breakpoints.down('md')]: {
      width: '40%',
      marginLeft: 0,
      textAlign: 'left',
    },
    [theme.breakpoints.down('sm')]: {
      width: '40%',
      marginLeft: 0,
      textAlign: 'left',
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    wordBreak: 'keep-all',
    fontWeight: 500,
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
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h2: {
    marginTop: '5px',
    marginBottom: '20px',
    fontSize: 45,
    fontWeight: 600,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      margin: '30px 0px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px'
    },
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  mainMiddleimg: {
    position: 'relative',
    width: '500px',
    height: '320px',
    margin: '20px 0px',
    '&>*': {
      transition: 'all 1.5s ease',
    },
    [theme.breakpoints.down('md')]: {
      width: '400px',
      height: '300px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '300px',
      height: '250px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '200px',
    },
  },
  mainMiddleCon1: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 30,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  mainMiddleCon2: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 20,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  mainMiddleCon3: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 10,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  duplicate2: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 150,
    zIndex: 10,
    width: 300,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      left: 120,
      width: 240,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      left: 100,
      width: 160,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      left: 70,
      width: 160,
      height: 60,
      borderRadius: '30px',
    },
  },
  duplicate3: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 400,
    zIndex: 11,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      left: 320,
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      left: 240,
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      left: 200,
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  clientlogo: {
    marginRight: 10,
    width: '40px',
    height: '40px',
    [theme.breakpoints.down('md')]: {
      width: '35px',
      height: '35px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '30px',
      height: '30px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '25px',
      height: '25px',
    },
  },
  conTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    fontSize: 25,
    margin: 0,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  conText: {
    margin: 2,
    fontFamily: 'Noto Sans KR',
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
    },
  },
  text: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  slide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subAdtitle: {
    color: 'red',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  subAdtitle2: {
    color: '#3154EB',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10
  },
  subAdtitle3: {
    color: '#0D93BF',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10,
  },
  subAdSub: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: 'red',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  subAdSub2: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#3154EB',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  subAdSub3: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#0D93BF',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  AdImg: {
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '340px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '280px',
    },
  }
}));

function Advantage(props) {
  const {
    source, MainUserType
  } = props;
  const classes = styles();

  const trigger = useScrollTrigger({ threshold: 1300, disableHysteresis: true });

  return (
    <div>
      { MainUserType === 'marketer' ? (
        <div className={classes.root}>
          <div className={classes.mainMiddle}>
            <div className={classes.AdImg}>
              <h1 className={classes.h1}>
                왜 온애드를 사용해야 할까요?
              </h1>
              <p className={classes.subAdtitle}>온애드의 장점</p>
              <div className={classes.mainMiddleimg}>

                <div className={classes.mainMiddleCon1}>
                  <img src="/pngs/main/main_client.png" alt="client" className={classes.clientlogo} />
                  <p className={classes.conTitle}>광고주</p>
                </div>

                <div className={!trigger ? (classes.mainMiddleCon2) : (classes.duplicate2)}>
                  <p className={classes.conTitle}>ONAD</p>
                  <p className={classes.conText}>광고협상, 배너협의</p>
                  <p className={classes.conText}>분석/적절성 검토</p>
                </div>

                <div className={!trigger ? (classes.mainMiddleCon3) : (classes.duplicate3)}>
                  <img src="/pngs/main/main_creator.png" alt="creator" className={classes.clientlogo} />
                  <p className={classes.conTitle}>CREATOR</p>
                </div>
              </div>
            </div>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle}>온애드의 장점 첫번째</p>
                <h1 className={classes.h1}>
                  크리에이터와의 협의 및 비용 협상?
                </h1>
              </div>
              <div>
                <h1 className={classes.h2}>
                  온애드에서는&nbsp;
                  <span className={classes.subAdSub}>필요없는 절차</span>
                  입니다
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.marketer.first.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.mainMiddle}>
            <div className={classes.AdImg}>
              <img src="/pngs/main/advantage2.png" className={classes.mainMiddleimg} alt="SecondAdvantage" />
            </div>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle2}>온애드의 장점 두번째</p>
                <h1 className={classes.h1}>
                  비용과 효과에 대한 실시간 검토가능
                </h1>
              </div>
              <div>
                <h1 className={classes.h2}>
                  <span className={classes.subAdSub2}>광고효과보고서</span>
                  &nbsp;제공
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.marketer.second.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.mainMiddle}>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle3}>온애드의 장점 세번째</p>
                <h1 className={classes.h1}>
                  합리적이고 체계화 된&nbsp;
                  <span className={classes.subAdSub3}>가격 책정 방식!</span>
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.marketer.third.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
            <div className={classes.AdImg}>
              <img src="/pngs/main/advantage3.png" className={classes.mainMiddleimg} alt="ThirdAdvantage" />
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.root}>
          <div className={classes.mainMiddle}>
            <div className={classes.AdImg}>
              <h1 className={classes.h1}>
                왜 온애드를 사용해야 할까요?
              </h1>
              <p className={classes.subAdtitle}>온애드의 장점</p>
              <div className={classes.mainMiddleimg}>

                <div className={classes.mainMiddleCon1}>
                  <img src="/pngs/main/main_creator.png" alt="client" className={classes.clientlogo} />
                  <p className={classes.conTitle}>CREATOR</p>
                </div>

                <div className={!trigger ? (classes.mainMiddleCon2) : (classes.duplicate2)}>
                  <p className={classes.conTitle}>ONAD</p>
                  <p className={classes.conText}>광고협상, 배너협의</p>
                  <p className={classes.conText}>분석/적절성 검토</p>
                </div>

                <div className={!trigger ? (classes.mainMiddleCon3) : (classes.duplicate3)}>
                  <img src="/pngs/main/main_client.png" alt="creator" className={classes.clientlogo} />
                  <p className={classes.conTitle}>광고주</p>
                </div>
              </div>
            </div>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle}>온애드의 장점 첫번째</p>
                <h1 className={classes.h1}>
                  광고주와의 협의 및 비용 협상?
                </h1>
              </div>
              <div>
                <h1 className={classes.h2}>
                  온애드에서는&nbsp;
                  <span className={classes.subAdSub}>필요없는 절차</span>
                  입니다
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.creator.first.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.mainMiddle}>
            <div className={classes.AdImg}>
              <img src="/pngs/main/advantageCreator2.gif" className={classes.mainMiddleimg} alt="SecondAdvantage" />
            </div>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle2}>온애드의 장점 두번째</p>
                <h1 className={classes.h1}>
                  광고주의 광고
                </h1>
              </div>
              <div>
                <h1 className={classes.h2}>
                  <span className={classes.subAdSub2}>URL로 쉽게송출</span>
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.creator.second.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.mainMiddle}>
            <div className={classes.loginButtonRight}>
              <div>
                <p className={classes.subAdtitle3}>온애드의 장점 세번째</p>
                <h1 className={classes.h1}>
                  광고 수익에 대한&nbsp;
                  <span className={classes.subAdSub3}>실시간 보고서 제공</span>
                </h1>
              </div>
              <div className={classes.h1sub}>
                {source.creator.third.split('\n').map(row => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
            <div className={classes.AdImg}>
              <img src="/pngs/main/advantageCreator3.png" className={classes.mainMiddleimg} alt="ThirdAdvantage" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Advantage;
