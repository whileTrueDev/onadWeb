import React, { useState } from 'react';
import axios from 'axios';
import shortid from 'shortid';
import apiHOST from '../../config/host';
import {
  Typography, Divider, Collapse
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import TransparentButton from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// atoms
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import Card from '../../atoms/Card/Card';
import Button from '../../atoms/CustomButtons/Button';

// types
const  AdpickCampaignTypeEnum = {
  INSTALL : '1', 
  SIGNUP : '3', 
  EVENT : '4',
  RESERVATION : '16'
} 

// styles
const useStyles = makeStyles(theme => ({
  img : {
    borderRadius: 10 
  },
  card: {
    backgroundColor : theme.palette.card
  },
  desc: {
    paddingLeft: 16, 
    display: 'flex', 
    alignItems: 'center'
  },
  text: {
    padding: 16
  },
  button: {
    padding: '0px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

}));

export default function CPACampaigns({ campaigns, isDesktopWidth, isMobile, os }) {
  const theme = useTheme();
  const classes = useStyles();
  // 상세보기 open state
  const [openIndex, setOpenIdx] = useState(null);
  function handleOpen(num) {
    if (num === openIndex) {
      setOpenIdx(null);
    } else {
      setOpenIdx(num);
    }
  }

  function renderOS(appOS){
    switch (appOS) {
      case "Both": return 'Android/iOS';
      case "Android": return 'Android 전용';
      case "iOS": return 'iOS 전용';
      default: return null;
    }
  }


  // Rendering Campaign types
  function renderType(typeNum) {
    switch (typeNum) {
      case AdpickCampaignTypeEnum.INSTALL: return '앱설치';
      case AdpickCampaignTypeEnum.SIGNUP: return '회원가입';
      case AdpickCampaignTypeEnum.EVENT: return '이벤트';
      case AdpickCampaignTypeEnum.RESERVATION: return '사전예약';
      default: return typeNum;
    }
  }
  
  return (
    <GridContainer style={{width: '100%'}} justify={isDesktopWidth ? "flex-start" : "center"} >
      {campaigns
        // .filter((cam) => !(cam.apType === AdpickCampaignTypeEnum.INSTALL))
        .map((item, idx) => (
          <GridItem key={item.apOffer} xs={10} md={4} lg={3} xl={3}>
            <Card className= {classes.card}>
              <div style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              >
                <img src={ item && item.apImages && item.apImages.icon} alt="" height="140" width="140" className= {classes.img} />

                <Typography style={{
                  fontWeight: 800,
                  display: 'block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  lineHeight: 2
                }}
                >
                  {item.apAppTitle}
                </Typography>
                
                {item.apOS ?
                <Typography style={{
                  fontWeight: 500,
                  display: 'block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  lineHeight: 1.5
                }}
                >
                  {renderOS(item.apOS)}
                </Typography>
                :
                 <div style={{ height: 32 }} />
              }
                {/* 캠페인 타입 */}
              </div>

              <div className={classes.desc}>
                <TransparentButton size="small" onClick={() => { handleOpen(idx); }}>
                  {openIndex === idx ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)}
                  <Typography variant="caption">
                    광고 설명 보기
                    {!(item.apHeadline || item.apKPI || item.apAppPromoText) && ' 없음'}
                  </Typography>
                </TransparentButton>
              </div>

              {(item.apHeadline || item.apKPI || item.apAppPromoText) && (
                <Collapse in={openIndex === idx}>
                  <div className= {classes.text}>
                    {item.apHeadline && (
                      <>
                        {item.apHeadline.split('\n').map((v) => (
                          <Typography variant="body2" key={shortid.generate()}>
                            {v}
                          </Typography>
                        ))}
                      </>
                    )}
                  </div>
                </Collapse>
              )}
              <Divider />
              <div className= {classes.button}>
                <Button
                  color="primary"
                  onClick={() => {
                    // 우리 클릭 트래킹 추가.
                    //  안드로이드 && (앱설치 + 회원가입)일때, 
                    if(isMobile && !(item.apOS === null || item.apOS === "Both") && os !== item.apOS ){
                      alert("접속하신 기기에서는 사용할 수 없는 앱입니다.");
                      return;
                    }
                    if(isMobile && os === "Android" && (item.apType === '1'  || item.apType === '3')){
                      alert('안드로이드는 PC 또는 모바일 웹 브라우저에서 참여가 가능합니다.');
                    }
                    axios.post(`${apiHOST}/adpage/banner/click`, { campaignId: item.campaignId, creatorId: item.creatorId });
                    window.location.href = item.apTrackingLink;
                  }}
                  style={{
                    backgroundColor : theme.palette.success.success,
                    color: 'white'
                  }}
                >
                  {renderType(item.apType)} 하러가기
                </Button>
              </div>
            </Card>
          </GridItem>
        ))}
    </GridContainer>

  );
}
