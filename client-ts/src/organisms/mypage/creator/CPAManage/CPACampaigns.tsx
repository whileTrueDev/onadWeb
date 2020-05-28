import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Typography, Divider, Collapse, FormControlLabel, Checkbox
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
import {
  CampaignResult, AdpickCampaignStateEnum, AdpickCampaignTypeEnum
} from './AdpickTypes';

// hooks
import useDialog from '../../../../utils/hooks/useDialog';
import useToggle from '../../../../utils/hooks/useToggle';
import usePostRequest from '../../../../utils/hooks/usePostRequest';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';

interface CPACampaignsProps {
  campaigns: CampaignResult[];
  getCampaign: () => void;
}

export default function CPACampaigns({
  campaigns,
  getCampaign,
}: CPACampaignsProps): JSX.Element {
  // For Themeing
  const theme = useTheme();

  // For 캠페인 등록 POST 요청
  const campaignStart = usePostRequest(
    '/creator/cpa/adpick/campaign', getCampaign
  );
  const campaignPatch = usePatchRequest(
    '/creator/cpa/adpick/campaign', getCampaign
  );

  // 상세보기 open state
  const [openIndex, setOpenIdx] = useState<number| null>(null);
  function handleOpen(num: number): void {
    if (num === openIndex) {
      setOpenIdx(null);
    } else {
      setOpenIdx(num);
    }
  }

  // 등록을 위해 선택된 캠페인 state
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResult | null>(null);
  // 등록 / 제외 dialog
  const activationDialog = useDialog();
  const deactivationDialog = useDialog();

  // 유의사항 확인 체크박스
  const confirmCheckbox = useToggle();

  // ***********************************************
  // util 함수

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

              {/* 등록중 상태 */}
              {item.campaignState === AdpickCampaignStateEnum.ACTIVE && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  padding: 8,
                  backgroundColor: theme.palette.success.light,
                  borderRadius: '0px 0px 5px 0px'
                }}
                >
                  <Typography variant="body2" style={{ color: 'white' }}>
                    등록됨
                  </Typography>
                </div>
              )}

              {/* 수익이 존재 + 제외 상태 => 정지됨 표시 */}
              {item.campaignIncome && item.campaignState === AdpickCampaignStateEnum.INACTIVE && (
              <div style={{
                position: 'absolute',
                left: 0,
                padding: 8,
                backgroundColor: theme.palette.secondary.light,
                borderRadius: '0px 0px 5px 0px'
              }}
              >
                <Typography variant="body2" style={{ color: 'white' }}>
                  제외됨
                </Typography>
              </div>
              )}


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
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              >
                {item.campaignState && (item.campaignState === AdpickCampaignStateEnum.ACTIVE) ? (
                  <Button
                    color="secondary"
                    style={{ color: 'white' }}
                    onClick={(): void => {
                      setSelectedCampaign(item);
                      deactivationDialog.handleOpen();
                    }}
                  >
                    제외하기
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={(): void => {
                      setSelectedCampaign(item);
                      activationDialog.handleOpen();
                    }}
                  >
                    등록하기
                  </Button>
                )}
                {item.campaignIncome && (
                  <div>
                    <Typography>해당 캠페인 수익</Typography>
                    <Typography style={{ fontWeight: 800 }}>{item.campaignIncome}</Typography>
                  </div>
                )}
              </div>
            </Card>
          </GridItem>
        ))}

      {/* 등록 다이얼로그 */}
      {selectedCampaign && (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={activationDialog.open}
        onClose={activationDialog.handleClose}
        title={`${selectedCampaign.apAppTitle} 등록`}
        buttons={(
          <div>
            <Button
              color="primary"
              onClick={(): void => {
                if (selectedCampaign.campaignState
                  && selectedCampaign.campaignState === AdpickCampaignStateEnum.INACTIVE) {
                  // 제외 상태인 경우
                  campaignPatch.doPatchRequest({
                    campaignId: selectedCampaign.apOffer,
                    targetState: AdpickCampaignStateEnum.ACTIVE
                  });
                } else {
                  // 첫 시작인 경우
                  campaignStart.doPostRequest({
                    campaignId: selectedCampaign.apOffer
                  });
                }
              }}
              disabled={!confirmCheckbox.toggle || campaignStart.loading}
            >
              등록
            </Button>
            <Button onClick={activationDialog.handleClose}>취소</Button>
          </div>
          )}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={selectedCampaign.apImages?.icon}
            alt=""
            height="100"
            width="100"
            style={{ textAlign: 'center', borderRadius: 10 }}
          />
        </div>
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
        <div style={{
          display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: 16
        }}
        >
          <Typography>
            해당 캠페인을 광고 페이지에 등록하시겠습니까?
          </Typography>
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                checked={confirmCheckbox.toggle}
                onChange={(): void => {
                  confirmCheckbox.handleToggle(); // sub url1 칸 열기
                }}
                size="small"
              />
          )}
            label={<Typography variant="caption">캠페인 홍보 유의사항과 미정산 조건을 확인하였습니다.</Typography>}
            labelPlacement="end"
          />
        </div>
      </Dialog>
      )}
      {/* 제외 다이얼로그 */}
      {selectedCampaign && (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={deactivationDialog.open}
        onClose={deactivationDialog.handleClose}
        title={`${selectedCampaign.apAppTitle} 제외`}
        buttons={(
          <div>
            <Button
              color="secondary"
              onClick={(): void => {
                // 제외 요청
                campaignPatch.doPatchRequest({
                  campaignId: selectedCampaign.apOffer,
                  targetState: AdpickCampaignStateEnum.INACTIVE
                });
              }}
              disabled={campaignStart.loading}
            >
              제외
            </Button>
            <Button onClick={deactivationDialog.handleClose}>취소</Button>
          </div>
          )}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={selectedCampaign.apImages?.icon}
            alt=""
            height="100"
            width="100"
            style={{ textAlign: 'center', borderRadius: 10 }}
          />
        </div>
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
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 16
        }}
        >
          <Typography>
            해당 캠페인을 광고 페이지에서 제외 하시겠습니까?
          </Typography>
          <Typography variant="caption">
            * 이미 발생한 수익은 그대로 유지됩니다.
          </Typography>
          <Typography variant="caption">
            * 캠페인은 곧바로 재등록이 가능합니다.
          </Typography>
        </div>
      </Dialog>
      )}
    </GridContainer>

  );
}
