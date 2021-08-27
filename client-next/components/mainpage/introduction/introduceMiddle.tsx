// material-UI
import { Typography, Button, Divider } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState } from 'react';
import classNames from 'classnames';
// 컴포넌트
// util 계열
// 스타일
import useStyles from '../../../styles/mainpage/introduction/introduceMiddle.style';

export default function IntroduceTop({ userType }: { userType: string | boolean }): JSX.Element {
  const classes = useStyles();

  const [platform, setFlatform] = useState(true);

  function handlePlatform(platformType: string): void {
    switch (platformType) {
      case 'afreecatv':
        return setFlatform(false);
      default:
        return setFlatform(true);
    }
  }

  return (
    <div className={classes.root}>
      {userType === 'marketer' ? (
        <div>
          <div className={classes.platformWrapper}>
            <Button
              onClick={(): void => handlePlatform('twitch')}
              className={classNames({
                [classes.selected]: platform,
                [classes.notSelected]: !platform,
              })}
            >
              트위치
            </Button>

            <Button
              onClick={(): void => handlePlatform('afreecatv')}
              className={classNames({
                [classes.selected]: !platform,
                [classes.notSelected]: platform,
              })}
            >
              아프리카tv
            </Button>
          </div>

          <div className={classes.cotentWrapper}>
            <div className={platform ? classes.leftLine : classes.leftLine2} />
            <div className={classes.content}>
              <div className={classes.contentTop}>
                <div>
                  <Typography variant="h2" className={classes.title}>
                    배너광고 (CPM)
                  </Typography>
                  <Typography variant="subtitle1">
                    생방송 화면에 노출되는 배너를 송출하여
                  </Typography>
                  <Typography variant="subtitle1">
                    상품 및 브랜드의 인지도를 높이는 광고입니다.
                  </Typography>
                </div>
                <img
                  src={
                    platform ? '/introduction/twitch_cpm.jpg' : '/introduction/afreecatv_cpm.jpg'
                  }
                  alt="exCPM"
                  className={classes.exImage}
                />
              </div>

              <div className={classes.contentBottom}>
                <div className={classes.subContent}>
                  <Typography variant="h4" className={classes.subtitle}>
                    광고 형식
                  </Typography>
                  <Typography variant="subtitle1">GIF, JPG, PNG 형식을 지원합니다.</Typography>
                  <Typography variant="subtitle1">해상도 1920*1080px 기준</Typography>
                  <Typography variant="subtitle1">배너 사이즈 320*160px입니다.</Typography>
                </div>
                <div className={classes.subContent}>
                  <Typography variant="h4" className={classes.subtitle}>
                    과금 기준
                  </Typography>
                  <Typography variant="subtitle1">시청자수 (1명) X 방송시간 X 2원</Typography>
                  <Typography variant="subtitle1">
                    2000cpm(1000회 노출당 비용=2000원/1000원)
                  </Typography>
                </div>
              </div>

              <Divider className={classes.divider} />

              <div className={classes.contentTop}>
                <div>
                  <Typography variant="h2" className={classes.title}>
                    광고 페이지 (CPC)
                  </Typography>
                  <Typography variant="subtitle1">
                    랜딩페이지 (회사 홈페이지, 쇼핑몰)로의 유입을 원하신다면?
                  </Typography>
                </div>
              </div>

              <div className={classes.contentBottom}>
                <div className={classes.subContent2}>
                  <img
                    src={
                      platform ? '/introduction/twitch_cpc.png' : '/introduction/afreecatv_cpc.png'
                    }
                    alt="exCPC"
                    className={classes.exImage2}
                  />
                </div>
                {platform ? (
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle}>
                      광고 형식 1. 패널
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">패널을 등록한 후 패널 클릭시</Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle2}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle}>
                      광고 형식 : 방송국 배너
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">
                      플로팅 혹은 하단 배너를 등록한 후 배너 클릭시
                    </Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle2}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                )}
              </div>

              {platform && (
                <div className={classes.contentBottom}>
                  <div className={classes.subContent2}>
                    <img
                      src="/introduction/twitch_chat.jpg"
                      alt="exChat"
                      className={classes.exImage2}
                    />
                  </div>
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle}>
                      광고 형식 2. 채팅봇
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">채팅봇 등록 후 채팅봇 클릭 시</Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle2}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={classes.platformWrapper}>
            <Button
              onClick={(): void => handlePlatform('twitch')}
              className={classNames({
                [classes.selected2]: platform,
                [classes.notSelected2]: !platform,
              })}
            >
              트위치
            </Button>

            <Button
              onClick={(): void => handlePlatform('afreecatv')}
              className={classNames({
                [classes.selected2]: !platform,
                [classes.notSelected2]: platform,
              })}
            >
              아프리카tv
            </Button>
          </div>

          <div className={classes.cotentWrapper}>
            <div className={platform ? classes.leftLine3 : classes.leftLine4} />
            <div className={classes.content}>
              <div className={classes.contentTop}>
                <div>
                  <Typography variant="h2" className={classes.title}>
                    배너광고 (CPM)
                  </Typography>
                  <Typography variant="subtitle1">
                    생방송 화면에 노출되는 배너를 송출하여
                  </Typography>
                  <Typography variant="subtitle1">
                    상품 및 브랜드의 인지도를 높이는 광고입니다.
                  </Typography>
                </div>
                <img
                  src={
                    platform ? '/introduction/twitch_cpm.jpg' : '/introduction/afreecatv_cpm.jpg'
                  }
                  alt="exCPM"
                  className={classes.exImage}
                />
              </div>

              <div className={classes.contentBottom}>
                <div className={classes.subContent}>
                  <Typography variant="h4" className={classes.subtitle3}>
                    광고 형식
                  </Typography>
                  <Typography variant="subtitle1">GIF, JPG, PNG 형식을 지원합니다.</Typography>
                  <Typography variant="subtitle1">해상도 1920*1080px 기준</Typography>
                  <Typography variant="subtitle1">배너 사이즈 320*160px입니다.</Typography>
                </div>
                <div className={classes.subContent}>
                  <Typography variant="h4" className={classes.subtitle3}>
                    과금 기준
                  </Typography>
                  <Typography variant="subtitle1">시청자수 (1명) X 방송시간 X 2원</Typography>
                  <Typography variant="subtitle1">
                    2000cpm(1000회 노출당 비용=2000원/1000원)
                  </Typography>
                </div>
              </div>

              <Divider className={classes.divider} />

              <div className={classes.contentTop}>
                <div>
                  <Typography variant="h2" className={classes.title}>
                    광고 페이지 (CPC)
                  </Typography>
                  <Typography variant="subtitle1">
                    랜딩페이지 (회사 홈페이지, 쇼핑몰)로의 유입을 원하신다면?
                  </Typography>
                </div>
              </div>

              <div className={classes.contentBottom}>
                <div className={classes.subContent2}>
                  <img
                    src={
                      platform ? '/introduction/twitch_cpc.png' : '/introduction/afreecatv_cpc.png'
                    }
                    alt="exCPC"
                    className={classes.exImage2}
                  />
                </div>
                {platform ? (
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle3}>
                      광고 형식 1. 패널
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">패널을 등록한 후 패널 클릭시</Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle4}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle3}>
                      광고 형식 : 방송국 배너
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">
                      플로팅 혹은 하단 배너를 등록한 후 배너 클릭시
                    </Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle4}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                )}
              </div>

              {platform && (
                <div className={classes.contentBottom}>
                  <div className={classes.subContent2}>
                    <img
                      src="/introduction/twitch_chat.jpg"
                      alt="exChat"
                      className={classes.exImage2}
                    />
                  </div>
                  <div className={classes.subContent2}>
                    <Typography variant="h4" className={classes.subtitle3}>
                      광고 형식 2. 채팅봇
                    </Typography>
                    <Typography variant="subtitle1">방송인이 개인방송 플랫폼(채널)에</Typography>
                    <Typography variant="subtitle1">채팅봇 등록 후 채팅봇 클릭 시</Typography>
                    <Typography variant="subtitle1">
                      지금 송출되는 광고 랜딩페이지로 이동합니다.
                    </Typography>
                    <Typography variant="h4" className={classes.subtitle4}>
                      과금 기준
                    </Typography>
                    <Typography variant="subtitle1">
                      100 CPC (클릭당 비용 = 100원 / 1회 클릭)
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
