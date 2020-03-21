import React from 'react';
import { useScrollTrigger } from '@material-ui/core';
import styles from '../style/Advantage.style';


interface Props {
  MainUserType: string;
  source: {
    marketer: {
      first: string;
      second: string;
      third: string;
    };
    creator: {
      first: string;
      second: string;
      third: string;
    };
  };
}

function Advantage({ source, MainUserType }: Props): JSX.Element {
  const classes = styles();
  const trigger = useScrollTrigger({ threshold: 1300, disableHysteresis: true });
  return (
    <div>
      {MainUserType === 'marketer' ? (
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
                {source.marketer.first.split('\n').map((row: string) => (
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
                {source.marketer.second.split('\n').map((row) => (
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
                {source.marketer.third.split('\n').map((row) => (
                  <p key={row} className={classes.text}>{`${row}`}</p>
                ))}
              </div>
            </div>
            <div className={classes.AdImg2}>
              <img src="/pngs/main/advantage3.gif" className={classes.mainMiddleimg} alt="ThirdAdvantage" />
            </div>
          </div>
        </div>
      )
        : (
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
                  {source.creator.first.split('\n').map((row) => (
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
                  {source.creator.second.split('\n').map((row) => (
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
                  {source.creator.third.split('\n').map((row) => (
                    <p key={row} className={classes.text}>{`${row}`}</p>
                  ))}
                </div>
              </div>
              <div className={classes.AdImg2}>
                <img src="/pngs/main/advantageCreator3.gif" className={classes.mainMiddleimg} alt="ThirdAdvantage" />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Advantage;
