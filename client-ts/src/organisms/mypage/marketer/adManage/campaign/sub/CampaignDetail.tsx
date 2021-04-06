import moment from 'moment';
import {
  Avatar,
  ButtonBase,
  makeStyles,
  Tooltip, Typography,
} from '@material-ui/core';
import React, { useCallback } from 'react';
import {
  CheckCircle, HighlightOff, OpenInNew
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import TimeSelector from '../../../../../../atoms/Selector/TimeSelector';
import { CampaignInterface } from '../../../dashboard/interfaces';
import renderBannerConfirmState, {
  CONFIRM_STATE_WAIT, CONFIRM_STATE_REJECTED, CONFIRM_STATE_CONFIRMED
} from '../../../../../../utils/render_funcs/renderBannerConfirmState';
import withJosa from '../../../../../../utils/withJosa';
import renderMerchandiseUploadState, { MERCHANDISE_UPLOAD_SOLDOUT, MERCHANDISE_UPLOAD_WAITING } from '../../../../../../utils/render_funcs/renderMerchandiseUploadState';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  linkUrl: {
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  middle: { verticalAlign: 'middle' },
  article: { marginTop: theme.spacing(2) },
  creatorsListWrapper: { display: 'flex', flexWrap: 'wrap', marginTop: theme.spacing(1) },
  creatorsList: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap', maxWidth: 60, textOverflow: 'ellipsis'
  },
}));

const CPS_OPTION_TYPE = 3; // CPS 캠페인 옵션 넘버
export interface CampaignDetailProps {
  campaign: CampaignInterface;
}
export default function CampaignDetail({
  campaign
}: CampaignDetailProps): React.ReactElement {
  const classes = useStyles();

  // 캠페인의 연결된 링크
  const landingUrl = campaign.linkData?.links.find((link) => link.primary);

  /**
     * 배너 또는 랜딩URL의 승인 여부에 따라 Typography 컴포넌트를 렌더링 합니다.
     * @param type 승인 여부 체크할 광고 소재 유형
     * @param confirmState 승인 여부
     */
  const renderConfirmState = useCallback((type: '배너' | '랜딩URL', confirmState: number): React.ReactElement => (
    <Typography color={confirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}>
      {`${type}심의 ${renderBannerConfirmState(confirmState)}`}
      {(confirmState === CONFIRM_STATE_CONFIRMED) && (
      <CheckCircle className={classes.middle} fontSize="small" color="primary" />
      )}
      {(confirmState === CONFIRM_STATE_REJECTED) && (
      <HighlightOff className={classes.middle} fontSize="small" color="error" />
      )}
    </Typography>
  ), [classes.middle]);

  return (
    <>
      {/* 거절된 배너 또는 랜딩페이지 URL이 연결된 캠페인인 경우. */}
      {(campaign.confirmState === CONFIRM_STATE_REJECTED
        || campaign.linkConfirmState === CONFIRM_STATE_REJECTED) && (
        <Alert severity="error">
          <Typography variant="body2">{`캠페인 ${campaign.campaignName} 에 연결된 배너 또는 랜딩페이지URL은 심의 거절되어, 광고 진행이 불가능합니다.`}</Typography>
          <Typography variant="body2">{`캠페인 ${campaign.campaignName} 을 삭제한 뒤, 새로운 캠페인을 생성하세요.`}</Typography>
        </Alert>
      )}
      {/* 심의 진행중인 배너 또는 랜딩페이지 URL이 연결된 캠페인인 경우. */}
      {(campaign.confirmState === CONFIRM_STATE_WAIT
        || campaign.linkConfirmState === CONFIRM_STATE_WAIT) && (
        <Alert severity="warning">
          <Typography variant="body2">{`캠페인 ${campaign.campaignName} 에 연결된 배너 또는 랜딩페이지URL은 심의 진행중으로, 현재 광고 진행이 불가능합니다.`}</Typography>
        </Alert>
      )}

      {/* CPS 캠페인의 상품이 아직 온애드몰에 업로드 되지 않은 경우 */}
      {campaign.merchandiseId && campaign.merchandiseName
      && campaign.merchandiseUploadState === MERCHANDISE_UPLOAD_WAITING
      && (// 캠페인 정보 불러올 때 업로드 상태도 불러오게 변경한 이후 추가.
        <Alert severity="error">
          <Typography variant="body2">
            {`캠페인 ${campaign.campaignName} 의 상품 -> ${withJosa(campaign.merchandiseName, '이/가')} 아직 온애드몰에 업로드되지 않아 광고 진행이 불가한 상태입니다.`}
          </Typography>
          <Typography variant="body2">조금만 기다려 주세요!!</Typography>
        </Alert>
      )}

      {/* CPS 캠페인의 상품이 아직 온애드몰에 업로드 되지 않은 경우 */}
      {campaign.merchandiseId && campaign.merchandiseName
      && campaign.merchandiseUploadState === 0
      && (// 캠페인 정보 불러올 때 업로드 상태도 불러오게 변경한 이후 추가.
        <Alert severity="error">
          <Typography variant="body2">
            {`캠페인 ${campaign.campaignName} 의 상품 -> ${withJosa(campaign.merchandiseName, '은/는')} 관리자에 의해 거절되었습니다.`}
          </Typography>
          <Typography variant="body2">{`사유는 ${campaign.merchandiseDenialReason}입니다. 문의는 support@onad.io 로 메일을 보내주세요.`}</Typography>
        </Alert>
      )}

      {/* CPS 캠페인의 상품이 재고 소진된 경우 */}
      {campaign.merchandiseId && campaign.merchandiseName
      && campaign.merchandiseStock && campaign.merchandiseSoldCount
      && (campaign.merchandiseStock - campaign.merchandiseSoldCount) <= 0 // 재고 소진으로 광고 진행 불가
        ? (
          <Alert severity="info">
            {campaign.merchandiseUploadState === MERCHANDISE_UPLOAD_SOLDOUT && (
            <Typography>축하합니다!! 해당 캠페인의 판매가 모두 완료되었습니다.</Typography>
            )}
            <Typography variant="body2">
              {`캠페인 ${campaign.campaignName} 의 상품 -> ${withJosa(campaign.merchandiseName, '이/가')} 재고 소진으로 인해 더이상 광고 진행이 불가한 상태입니다.`}
            </Typography>
            <Typography variant="body2">더 많은 상품 판매를 원하신다면 새로 상품을 등록하고 캠페인을 등록해주세요.</Typography>
          </Alert>
        ) : null}

      <article className={classes.article}>
        <Typography className={classes.bold}>현재 캠페인 상태</Typography>
        {renderConfirmState('배너', campaign.confirmState)}
        {campaign.linkId && campaign.linkConfirmState && (
        <span>
          {renderConfirmState('랜딩URL', campaign.linkConfirmState)}
        </span>
        )}
        {campaign.merchandiseId && (
          <>
            <Typography>
              {`상품 판매 상태 - ${renderMerchandiseUploadState(campaign.merchandiseUploadState || null)}`}
              {Boolean(campaign.merchandiseUploadState) && (
                <CheckCircle className={classes.middle} fontSize="small" color="primary" />
              )}
            </Typography>
          </>
        )}
      </article>

      {landingUrl && (
      <article className={classes.article}>
        <Typography className={classes.bold}>랜딩페이지 URL</Typography>
        <Typography>{landingUrl.linkName}</Typography>
        <Typography
          color="primary"
          className={classes.linkUrl}
          onClick={(): void => {
            window.open(landingUrl.linkTo, '_blank');
          }}
        >
          {landingUrl.linkTo}
          <OpenInNew fontSize="small" className={classes.middle} />
        </Typography>
      </article>
      )}

      {/* 상품 URL */}
      {campaign.merchandiseItemSiteUrl && (
      <article className={classes.article}>
        <Typography className={classes.bold}>상품페이지 URL</Typography>
        <Typography
          color="primary"
          className={classes.linkUrl}
          onClick={(): void => {
            window.open(campaign.merchandiseItemSiteUrl, '_blank');
          }}
        >
          <OpenInNew fontSize="small" className={classes.middle} />
          {campaign.merchandiseItemSiteUrl}
        </Typography>
      </article>
      )}

      <article className={classes.article}>
        <Typography className={classes.bold}>홍보 문구</Typography>
        <Typography>{campaign.campaignDescription}</Typography>
      </article>

      {campaign.optionType !== CPS_OPTION_TYPE ? (
        <article className={classes.article}>
          <Typography className={classes.bold}>일일 예산</Typography>
          <Typography>
            {campaign.dailyLimit === -1 ? '설정 안함' : campaign.dailyLimit.toLocaleString()}
          </Typography>
        </article>
      ) : (
        <>
          {campaign.merchandiseStock && (
          <article className={classes.article}>
            <Typography className={classes.bold}>상품 재고 상태</Typography>
            <Typography variant="body2" color="textSecondary">(판매된재고 / 총재고)로 표시됩니다.</Typography>
            <Typography>
              {`${campaign.merchandiseSoldCount || 0} / ${campaign.merchandiseStock || 0}`}
            </Typography>
          </article>
          )}
        </>
      )}

      <article className={classes.article}>
        <Typography className={classes.bold}>송출 기간</Typography>
        {campaign.startDate && (
        <Typography>{moment(campaign.startDate).format('YYYY년 MM월 DD일 부터')}</Typography>
        )}
        {campaign.finDate && (
        <Typography>{moment(campaign.finDate).format('YYYY년 MM월 DD일 까지')}</Typography>
        )}
      </article>

      <article className={classes.article}>
        <Typography className={classes.bold}>송출 시간</Typography>
        <TimeSelector timeList={campaign.selectedTime} />
      </article>

      <article className={classes.article}>
        <Typography className={classes.bold}>송출 목록</Typography>
        {campaign.targetCreators ? (
          <div>
            <Typography color="textSecondary" variant="body2">방송인 클릭시, 해당 방송인의 채널/방송국으로 이동합니다.</Typography>
            <div className={classes.creatorsListWrapper}>
              {campaign.targetCreators.map((creator) => (
                <div key={creator.creatorId}>
                  <Tooltip
                    title={(creator.afreecaName && creator.creatorName)
                      ? `${creator.creatorName}(${creator.afreecaName})`
                      : (creator.creatorName || creator.afreecaName)!}
                  >
                    <ButtonBase
                      className={classes.creatorsList}
                      onClick={(): void => {
                        if (creator.afreecaId) window.open(`http://play.afreecatv.com/${creator.afreecaId}`);
                        else if (creator.creatorTwitchId) window.open(`https://twitch.tv/${creator.creatorTwitchId}`);
                      }}
                    >
                      <Avatar src={creator.creatorLogo || creator.afreecaLogo} />
                      <Typography noWrap variant="body2">
                        {(creator.afreecaName && creator.creatorName)
                          ? `${creator.creatorName}(${creator.afreecaName})`
                          : creator.creatorName || creator.afreecaName}
                      </Typography>
                    </ButtonBase>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Typography>{campaign.targetList.join(', ')}</Typography>
        )}
      </article>
    </>
  );
}
