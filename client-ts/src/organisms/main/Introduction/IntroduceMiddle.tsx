import React from 'react';
import { Grow, useScrollTrigger } from '@material-ui/core';
import useStyles from './style/IntroduceMiddle.style';


export default function IntroduceTop({ userType }: { userType: string | boolean }): JSX.Element {
  const classes = useStyles();
  const trigger = useScrollTrigger({ threshold: 850, disableHysteresis: true });
  const trigger2 = useScrollTrigger({ threshold: 1650, disableHysteresis: true });

  return (
    <div>
      {userType ? (
        <div className={classes.root}>
          <div className={classes.mainMiddle}>
            <div className={classes.costContent}>
              <p className={classes.subAdtitle}>크리에이터 배너광고</p>
              <h1 className={classes.h1}>
                배너광고(CPM)
              </h1>
              <p className={classes.subAdtitle2}>생방송 화면에 노출되는 배너를 송출하여 상품 및 브랜드의 인지도를 높이는 광고입니다.</p>
              <div className={classes.costCard}>
                <h3 className={classes.costCardTitle}>광고형식</h3>
                <p className={classes.costCardCon}>GIF, JPG, PNG 형식을 지원합니다.</p>
                <p className={classes.costCardCon}>배너사이즈 1920X1080(px) 기준 배너크기 320X160(px)</p>
              </div>
              <div className={classes.costCard}>
                <h3 className={classes.costCardTitle}>
                  과금기준&nbsp;
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

          <div className={classes.mainMiddle2}>
            <div className={classes.costContent2}>
              <p className={classes.subAdtitle}>배너광고에서 클릭까지</p>
              <h1 className={classes.h1}>
                광고페이지(CPC)
              </h1>
              <p className={classes.subAdtitle2}>
                랜딩 페이지(예: 회사 홈페이지, 쇼핑몰)로의 유입을 원하는 광고주를 위한 형태
              </p>
              <div className={classes.costCardWrapper}>
                <div className={classes.costCard2}>
                  <h3 className={classes.costCardTitle}>광고형식 1. 패널</h3>
                  <p className={classes.costCardCon}>크리에이터님이 개인방송 플랫폼(채널)에 패널 등록 후</p>
                  <p className={classes.costCardCon}>패널 클릭시 지금 송출되는 광고 랜딩페이지로 이동합니다.</p>
                </div>
                <div className={classes.costCard2}>
                  <h3 className={classes.costCardTitle}>
                    과금기준
                  </h3>
                  <p className={classes.costCardCon}>100 CPC (클릭당 비용 = 100원/1회 클릭)</p>
                </div>
              </div>
              <div className={classes.loginButtonRight2}>
                <Grow in={trigger2} timeout={1000}>
                  <img src="/pngs/introduction/exCPC.png" alt="exCPC" className={classes.exBanner2} />
                </Grow>
              </div>


              <div className={classes.costCardWrapper}>
                <div className={classes.costCard2}>
                  <h3 className={classes.costCardTitle}>광고형식 2. 채팅봇</h3>
                  <p className={classes.costCardCon}>크리에이터님이 개인방송 플랫폼(채널)에 채팅봇 등록 후</p>
                  <p className={classes.costCardCon}>채팅봇 클릭시 지금 송출되는 광고 랜딩페이지로 이동합니다.</p>
                </div>
                <div className={classes.costCard2}>
                  <h3 className={classes.costCardTitle}>
                    과금기준
                  </h3>
                  <p className={classes.costCardCon}>100 CPC (클릭당 비용 = 100원/1회 클릭)</p>
                </div>
              </div>
              <div className={classes.loginButtonRight2}>
                <Grow in={trigger2} timeout={1400}>
                  <img src="/pngs/introduction/exChatbot.png" alt="exCPC" className={classes.exBanner2} />
                </Grow>
              </div>
            </div>
          </div>
        </div>
      )
        : (
          <div className={classes.root}>
            <div className={classes.mainMiddle}>
              <div className={classes.costContent}>
                <p className={classes.subAdtitle}>크리에이터 배너광고</p>
                <h1 className={classes.h1}>
                  방송에만 집중하세요
                </h1>
                <p className={classes.subAdtitle2}>
                  광고섭외, 계약, 예산협의 그리고 세금처리까지&#10;어려운 일들은 저희가 책임질게요
                  <span role="img" aria-label="emoji">💪</span>
                </p>
                <div className={classes.costCard}>
                  <h3 className={classes.costCardTitle}>배너광고</h3>
                  <p className={classes.costCardCon}>
                    오버레이창만 띄우면 배너가 뙇!
                    <span role="img" aria-label="emoji">👏🏻</span>
                  </p>
                  <p className={classes.costCardCon}>해상도 1920X1080(px) 기준 배너크기 320X160(px)입니다</p>
                </div>
                <div className={classes.costCard}>
                  <h3 className={classes.costCardTitle}>
                    수익금
                  </h3>
                  <p className={classes.costCardCon}>실시간 시청자수에 따라 수익금이 쌓입니다</p>
                  <p className={classes.costCardCon}>3만원 이상 적립시 언제든 출금신청 가능!</p>
                </div>
              </div>
              <div className={classes.loginButtonRight}>
                <Grow in={trigger} timeout={1000}>
                  <img src="/pngs/introduction/exCPM.png" alt="exCPM" className={classes.exBanner} />
                </Grow>
              </div>
            </div>

            <div className={classes.mainMiddle2}>
              <div className={classes.costContent2}>
                <p className={classes.subAdtitle}>배너광고에서 클릭까지</p>
                <h1 className={classes.h1}>
                  지금 송출되는 광고 클릭해봐요
                </h1>
                <p className={classes.subAdtitle2}>
                  시청자의 참여와 관심이 추가 수익으로!
                  <span role="img" aria-label="emoji">😲</span>
                </p>
                <div className={classes.costCardWrapper}>
                  <div className={classes.costCard2}>
                    <h3 className={classes.costCardTitle}>광고형식 1. 패널</h3>
                    <p className={classes.costCardCon}>크리에이터님이 개인방송 플랫폼(채널)에 패널 등록 후</p>
                    <p className={classes.costCardCon}>패널 클릭시 지금 송출되는 광고 랜딩페이지로 이동합니다.</p>
                  </div>
                  <div className={classes.costCard2}>
                    <h3 className={classes.costCardTitle}>
                      수익금
                    </h3>
                    <p className={classes.costCardCon}>시청자의 참여도(클릭, 다운로드, 구매 등)에 따라 수익이 쌓입니다</p>
                    <p className={classes.costCardCon}>배너광고와 별도로 적립돼요!</p>
                  </div>
                </div>
                <div className={classes.loginButtonRight2}>
                  <Grow in={trigger2} timeout={1000}>
                    <img src="/pngs/introduction/exCPC.png" alt="exCPC" className={classes.exBanner2} />
                  </Grow>
                </div>


                <div className={classes.costCardWrapper}>
                  <div className={classes.costCard2}>
                    <h3 className={classes.costCardTitle}>광고형식 2. 채팅봇</h3>
                    <p className={classes.costCardCon}>크리에이터님이 개인방송 플랫폼(채널)에 채팅봇 등록 후</p>
                    <p className={classes.costCardCon}>채팅봇 클릭시 지금 송출되는 광고 랜딩페이지로 이동합니다.</p>
                  </div>
                  <div className={classes.costCard2}>
                    <h3 className={classes.costCardTitle}>
                      수익금
                    </h3>
                    <p className={classes.costCardCon}>시청자의 참여도(클릭, 다운로드, 구매 등)에 따라 수익이 쌓입니다</p>
                    <p className={classes.costCardCon}>패널의 클릭과 합산되어 적립돼요!</p>
                  </div>
                </div>
                <div className={classes.loginButtonRight2}>
                  <Grow in={trigger2} timeout={1400}>
                    <img src="/pngs/introduction/exChatbot.png" alt="exCPC" className={classes.exBanner2} />
                  </Grow>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
