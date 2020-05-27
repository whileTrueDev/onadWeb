import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Typography, Divider, Collapse
} from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import TransparentButton from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// atoms
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';

// types
import { AdPickData } from './AdpickTypes';

// hooks
import useDialog from '../../../../utils/hooks/useDialog';

interface CPACampaignsProps {
  campaigns: AdPickData[];
}
enum AdpickCampaignTypeEnum {
  INSTALL = '1', SIGNUP = '3', EVENT = '4', RESERVATION = '16'
}

export default function CPACampaigns({
  campaigns,

}: CPACampaignsProps): JSX.Element {
  const theme = useTheme();

  // 상세보기 open state
  const [openIndex, setOpenIdx] = useState<number| null>(null);
  function handleOpen(num: number): void {
    if (num === openIndex) {
      setOpenIdx(null);
    } else {
      setOpenIdx(num);
    }
  }

  // 진행을 위해 선택된 캠페인 state
  const [selectedCampaign, setSelectedCampaign] = useState<AdPickData | null>(null);
  // 진행 confirmDialog dialog
  const confirmDialog = useDialog();

  // Rendering Campaign types
  function renderType(typeNum: string): string {
    switch (typeNum) {
      case AdpickCampaignTypeEnum.INSTALL: return '앱설치';
      case AdpickCampaignTypeEnum.SIGNUP: return '회원가입';
      case AdpickCampaignTypeEnum.EVENT: return '이벤트';
      case AdpickCampaignTypeEnum.RESERVATION: return '사전예약';
      default: return typeNum;
    }
  }
  return (
    <GridContainer>
      {campaigns
        .filter((cam) => !(cam.apType === AdpickCampaignTypeEnum.INSTALL))
        .map((item, idx) => (
          <GridItem key={item.apOffer} xs={12} md={4} lg={3} xl={3}>
            <Card>
              <div style={{
                position: 'absolute',
                left: 0,
                padding: 8,
                backgroundColor: theme.palette.success.light,
                borderRadius: '0px 0px 5px 0px'
              }}
              >
                <Typography variant="body2" style={{ color: 'white' }}>
                  진행중
                </Typography>
              </div>

              <div style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              >
                <img src={item.apImages?.icon} alt="" height="100" width="100" style={{ borderRadius: 10 }} />

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
                {/* 캠페인 타입 */}
                <Typography variant="body2">
                  {renderType(item.apType)}
                </Typography>

                {/* dailycap */}
                {item.apDailyCap === '0' || item.apDailyCap === 0 ? (
                  <Typography variant="body2">
                    {'남은 횟수 '}
                    {item.apRemain === 10000 ? '무제한' : `${item.apRemain}`}
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    {`오늘 ${item.apRemain}/${item.apDailyCap}`}
                  </Typography>
                )}

                {/* 수익금 */}
                <Typography style={{ fontWeight: 800, lineHeight: 1.5 }}>
                  {item.apPayout}
                  {' '}
                  원
                </Typography>
              </div>

              <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
                <TransparentButton size="small" onClick={(): void => { handleOpen(idx); }}>
                  {openIndex === idx ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)}
                  <Typography variant="caption">
                    상세보기
                    {!(item.apHeadline || item.apKPI || item.apAppPromoText) && ' 없음'}
                  </Typography>
                </TransparentButton>
              </div>

              {(item.apHeadline || item.apKPI || item.apAppPromoText) && (
              <Collapse in={openIndex === idx}>
                <div style={{ padding: 16 }}>
                  {item.apHeadline && (
                    <>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 700, margin: '8px 0px' }}
                      >
                        캠페인 한줄 설명
                      </Typography>
                      {item.apHeadline.split('\n').map((v) => (
                        <Typography variant="body2" key={shortid.generate()}>
                          {v}
                        </Typography>
                      ))}
                    </>
                  )}

                  {item.apKPI && (
                    <>
                      <Divider />
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 700, margin: '8px 0px' }}
                      >
                        캠페인 미정산 조건

                      </Typography>
                      {item.apKPI.split('\n').map((v) => (
                        <Typography variant="body2" key={shortid.generate()}>
                          {v}
                        </Typography>
                      ))}
                    </>
                  )}

                  {item.apAppPromoText && (
                    <>
                      <Divider />
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 700, margin: '8px 0px' }}
                      >
                        캠페인 프로모션 텍스트

                      </Typography>
                      {item.apAppPromoText.split('\n').map((v) => (
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
              <div style={{
                padding: '0px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              >
                {'1,000' && (
                  <div>
                    <Typography>해당 캠페인 수익</Typography>
                    <Typography style={{ fontWeight: 800 }}>1,000</Typography>
                  </div>
                )}
                <Button
                  color="primary"
                  onClick={(): void => {
                    setSelectedCampaign(item);
                    confirmDialog.handleOpen();
                  }}
                >
                  진행

                </Button>
              </div>
            </Card>
          </GridItem>
        ))}

      {selectedCampaign && (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        title={selectedCampaign.apAppTitle}
        buttons={(
          <div>
            <Button
              color="primary"
              onClick={(): void => { console.log(`${selectedCampaign.apAppTitle}진행 클릭`); }}
            >
              진행
            </Button>
            <Button onClick={confirmDialog.handleClose}>취소</Button>
          </div>
          )}
      >
        <Typography variant="body1" style={{ fontWeight: 700, margin: '8px 0px' }}>
          캠페인 명
        </Typography>
        <Typography variant="body2">
          {selectedCampaign.apAppTitle}
        </Typography>
        <Typography variant="body1" style={{ fontWeight: 700, margin: '8px 0px' }}>
          캠페인 방식
        </Typography>
        <Typography variant="body2">
          {renderType(selectedCampaign.apType)}
        </Typography>
        {selectedCampaign.apHeadline && (
          <>
            <Typography variant="body1" style={{ fontWeight: 700, margin: '8px 0px' }}>
              캠페인 한줄 설명
            </Typography>
            {selectedCampaign.apHeadline.split('\n').map((v) => (
              <Typography variant="body2" key={shortid.generate()}>
                {v}
              </Typography>
            ))}
          </>
        )}
        <Typography variant="body1" style={{ fontWeight: 700, margin: '8px 0px' }}>
          전환시 수익 금액
        </Typography>
        <Typography variant="body2">
          {selectedCampaign.apPayout}
          {' '}
          원
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Typography>
            해당 캠페인을 광고 페이지에 등록하시겠습니까?
          </Typography>
        </div>
      </Dialog>
      )}
    </GridContainer>

  );
}
