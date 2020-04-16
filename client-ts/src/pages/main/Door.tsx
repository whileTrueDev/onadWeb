import React from 'react';
import useStyles from './style/Door.style';


export default function Door(): JSX.Element {
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
          <h1 className={classes.fontStyle3}><strong>광고주</strong></h1>
          <h1 className={classes.fontStyle}><strong>브랜드를 홍보하고 싶은 광고주!</strong></h1>
          <h3 className={classes.fontStyle2}>1인 미디어 컨텐츠 속 광고,</h3>
          <h3 className={classes.fontStyle2}>복잡한 절차 없이 진행하세요</h3>
          <a href="/marketer" className={classes.linkStyle}>바로가기</a>
        </div>
      </div>
      <div className={classes.creator}>
        <div className={classes.creatorWrap}>
          <div className={classes.linear} />
          <div className={classes.creatorContent} id="creatorContent">
            <img src="/pngs/main/main_creator.png" alt="creator" className={classes.icon} />
            <h1 className={classes.fontStyle3}><strong>방송인</strong></h1>
            <h1 className={classes.fontStyle}><strong>광고 수익을 원하는 방송인!</strong></h1>
            <h3 className={classes.fontStyle2}>1인 미디어 방송인의 파트너</h3>
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
}
