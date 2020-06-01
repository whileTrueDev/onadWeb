import React, { useState } from 'react';
import classnames from 'classnames';
import shortid from 'shortid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Typography, Divider, Collapse, ButtonGroup
} from '@material-ui/core';
import TransparentButton from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// atoms
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import Button from '../../../../atoms/CustomButtons/Button';

// sub organisms
import CPAStatus from './sub/CPAStatus';
import CPACampaignIcon from './sub/CPACampaignIcon';

// types
import {
  CampaignResult, AdpickCampaignStateEnum, AdpickCampaignTypeEnum
} from './AdpickTypes';

const useStyles = makeStyles((theme) => ({
  hardbold: { fontWeight: 800 },
  longline: { lineHeight: 2 },
  title: {
    fontWeight: 800,
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  topmargin2: { marginTop: theme.spacing(2) },
  left2: { paddingLeft: theme.spacing(2) },
  topbottom1: { margin: '8px 0px', },
  flex: { display: 'flex', alignItems: 'center' },
  container: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonsetContainer: {
    padding: '0px 16px',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  }
}));

interface CPACampaignsProps {
  campaigns: CampaignResult[];
  onStartClick: (item: CampaignResult) => () => void;
  onStopClick: (item: CampaignResult) => () => void;
}

// Lookup arrays
const apTypeLookup = [
  { name: AdpickCampaignTypeEnum.INSTALL, lookup: '앱설치' },
  { name: AdpickCampaignTypeEnum.SIGNUP, lookup: '회원가입' },
  { name: AdpickCampaignTypeEnum.EVENT, lookup: '이벤트' },
  { name: AdpickCampaignTypeEnum.RESERVATION, lookup: '사전예약' }
];
export default function CPACampaigns({
  campaigns, onStartClick, onStopClick
}: CPACampaignsProps): JSX.Element {
  // classes
  const classes = useStyles();

  // 상세보기 open state
  const [openIndex, setOpenIdx] = useState<number| null>(null);
  function handleOpen(num: number): void {
    if (num === openIndex) {
      setOpenIdx(null);
    } else {
      setOpenIdx(num);
    }
  }

  // 필터링 배열 state
  const [filterArray, setFilterArray] = useState<string[]>(apTypeLookup.map((x) => x.name));
  function handleFilterArray(item: string): void {
    if (filterArray?.includes(item)) {
      // 이미 목록에 있으면 제거
      setFilterArray(filterArray?.filter((x) => x !== item));
    } else {
      // 목록에 없는 경우 목록에 추가
      setFilterArray(filterArray?.concat(item));
    }
  }

  // ***********************************************
  // util 함수

  function renderOS(ostype?: string): string {
    const apOSLookup = ['Android', 'IOS', 'OS 상관없음'];
    switch (ostype) {
      case 'Android': return apOSLookup[0];
      case 'IOS': return apOSLookup[1];
      default: return apOSLookup[2];
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} className={classes.topmargin2}>
        <Typography variant="h6">참여형 광고 목록</Typography>
        <ButtonGroup
          className={classes.topmargin2}
          color="primary"
          aria-label="aptype button group"
        >
          {apTypeLookup.map((type) => (
            <Button
              key={type.name}
              variant={filterArray.includes(type.name) ? 'contained' : 'outlined'}
              onClick={(): void => {
                handleFilterArray(type.name);
              }}
            >
              {type.lookup}
            </Button>
          ))}
        </ButtonGroup>
      </GridItem>
      {campaigns
        // .filter((cam) => !(cam.apType === AdpickCampaignTypeEnum.INSTALL)) // 설치형 제외
        .filter((cam) => !(cam.apOffer === '4ed8e')) // 애드픽 회원가입 제외
        .filter((cam) => filterArray.includes(cam.apType)) // 캠페인 타입 필터링
        .map((item, idx) => (
          <GridItem key={item.apOffer} xs={12} md={4} lg={3} xl={3}>
            <Card>

              {/* 등록중 상태 */}
              {item.campaignState === AdpickCampaignStateEnum.ACTIVE && (
                <CPAStatus color="primary" />
              )}

              {/* 수익이 존재 + 제외 상태 => 정지됨 표시 */}
              {item.campaignIncome && item.campaignState === AdpickCampaignStateEnum.INACTIVE && (
                <CPAStatus color="secondary" />
              )}

              <div className={classnames(classes.flex, classes.container)}>
                {/* 캠페인 로고 */}
                <CPACampaignIcon src={item.apImages?.icon} />

                {/* 캠페인 이름 */}
                <Typography
                  className={classnames(classes.title, classes.hardbold, classes.longline)}
                >
                  {item.apAppTitle}
                </Typography>

                {/* 캠페인 타입 */}
                <Typography variant="body2">
                  {apTypeLookup.find((x) => x.name === item.apType)?.lookup}
                </Typography>

                {/* 캠페인 타입 */}
                <Typography variant="body2">
                  {renderOS(item.apOS)}
                </Typography>

                {/* DailyCap 과 남은 수 */}
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

                {/* 캠페인 조건 달성 시 수익금 */}
                <Typography className={classes.hardbold}>
                  {`${item.apPayout} 원`}
                </Typography>
              </div>

              {/* 상세보기 버튼 */}
              <div className={classnames(classes.flex, classes.left2)}>
                <TransparentButton
                  size="small"
                  onClick={(): void => { handleOpen(idx); }}
                >
                  {openIndex === idx ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)}
                  <Typography variant="caption">
                    상세보기
                    {!(item.apHeadline || item.apKPI || item.apAppPromoText) && ' 없음'}
                  </Typography>
                </TransparentButton>
              </div>

              {/* 상세보기 패널 */}
              {(item.apHeadline || item.apKPI || item.apAppPromoText) && (
              <Collapse in={openIndex === idx}>
                <div className={classes.left2}>
                  {item.apHeadline && (
                    <>
                      <Typography
                        variant="body1"
                        className={classnames(classes.hardbold, classes.topbottom1)}
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
                        className={classnames(classes.hardbold, classes.topbottom1)}
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
                        className={classnames(classes.hardbold, classes.topbottom1)}
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

              {/* 캠페인 등록/제외 버튼 셋트 */}
              <Divider />
              <div className={classnames(classes.flex, classes.buttonsetContainer)}>
                {item.campaignState && (item.campaignState === AdpickCampaignStateEnum.ACTIVE) ? (
                  <Button
                    color="secondary"
                    style={{ color: 'white' }}
                    onClick={onStopClick(item)}
                  >
                    제외하기
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={onStartClick(item)}
                  >
                    등록하기
                  </Button>
                )}
                {item.campaignIncome && (
                  <div>
                    <Typography>해당 캠페인 수익</Typography>
                    <Typography className={classes.hardbold}>{item.campaignIncome}</Typography>
                  </div>
                )}
              </div>
            </Card>
          </GridItem>
        ))}
    </GridContainer>

  );
}
