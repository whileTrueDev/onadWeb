import moment from 'moment';
import classnames from 'classnames';
import {
  Avatar,
  ButtonBase,
  makeStyles, Tooltip, Typography,
} from '@material-ui/core';
import React from 'react';
import { CheckCircle, HighlightOff, OpenInNew } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import TimeSelector from '../../../../../../atoms/Selector/TimeSelector';
import { CampaignInterface } from '../../../dashboard/interfaces';
import renderBannerConfirmState, { CONFIRM_STATE_WAIT, CONFIRM_STATE_REJECTED, CONFIRM_STATE_CONFIRMED } from '../../../../../../utils/render_funcs/renderBannerConfirmState';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(0, 0, 2,)
  },
  title: { marginBottom: theme.spacing(2) },
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


export interface CampaignInformationProps {
  campaign: CampaignInterface;
}
export default function CampaignInformation({
  campaign,
}: CampaignInformationProps): JSX.Element {
  const classes = useStyles();

  // const campaignDescription = useEventTargetValue(campaign.campaignDescription);

  const landingUrl = campaign.linkData?.links.find((link) => link.primary);

  function renderConfirmState(type: '배너' | '랜딩URL', confirmState: number): React.ReactElement {
    return (
      <Typography color={confirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}>
        {`${type}심의 ${renderBannerConfirmState(confirmState)}`}
        {(confirmState === CONFIRM_STATE_CONFIRMED) && (
        <CheckCircle className={classes.middle} fontSize="small" color="primary" />
        )}
        {(confirmState === CONFIRM_STATE_REJECTED) && (
        <HighlightOff className={classes.middle} fontSize="small" color="error" />
        )}
      </Typography>
    );
  }

  return (
    <div className={classes.container}>
      <Typography
        variant="h6"
        className={classnames(classes.title, classes.bold)}
      >
        상세 정보
      </Typography>

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

      <article className={classes.article}>
        <Typography className={classes.bold}>현재 캠페인 상태</Typography>
        {renderConfirmState('배너', campaign.confirmState)}
        {renderConfirmState('랜딩URL', campaign.linkConfirmState)}
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

      <article className={classes.article}>
        <Typography className={classes.bold}>홍보 문구</Typography>
        <Typography>{campaign.campaignDescription}</Typography>
      </article>

      <article className={classes.article}>
        <Typography className={classes.bold}>일일 예산</Typography>
        <Typography>
          {campaign.dailyLimit === -1 ? '설정 안함' : campaign.dailyLimit.toLocaleString()}
        </Typography>
      </article>

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


    </div>
  );
}
