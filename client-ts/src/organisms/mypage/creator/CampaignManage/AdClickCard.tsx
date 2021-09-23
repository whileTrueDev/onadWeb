import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Popover,
  Typography,
} from '@material-ui/core';
import classnames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { useAnchorEl } from '../../../../utils/hooks';
import { useCreatorClicks } from '../../../../utils/hooks/query/useCreatorClicks';
import { useCreatorClicksCurrent } from '../../../../utils/hooks/query/useCreatorClicksCurrent';

dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
  container: {
    height: 200,
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: { height: 400 },
  },
  divider: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  line: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  buttonText: { cursor: 'pointer', '&:hover': { textDecoration: 'underline' } },
}));

export interface CurrentClickRes {
  id: string;
  clickedTime: string;
  costType: string;
  linkId: string;
  campaignName: string;
  creatorId: string;
  payout: number;
  channel: string;
  os: string;
  browser: string;
  links?: {
    links: Array<{ primary: boolean; linkTo: string; linkName: string }>;
  };
  merchandiseId?: number;
  itemSiteUrl?: string;
}
export default function AdClickCard(): JSX.Element {
  const classes = useStyles();
  const clicks = useCreatorClicks();

  const [currentClicksPage, setCurrentClicksPage] = useState(0);
  function handleNext(): void {
    setCurrentClicksPage(prev => prev + 1);
  }
  function handleBack(): void {
    if (currentClicksPage > 0) {
      setCurrentClicksPage(prev => prev - 1);
    }
  }
  const CURRENT_CLICK_OFFSET = 3;
  // 최근 클릭 로그 조회
  const currentClicks = useCreatorClicksCurrent({
    offset: CURRENT_CLICK_OFFSET,
    page: currentClicksPage,
  });

  const renderClickChannel = (type: string): string => {
    if (type === 'adchat') return '채팅광고';
    if (type === 'adpanel') return '광고클릭';
    if (type === 'adpage') return '참여형';
    return '';
  };

  // 선택된 광고클릭 객체
  const [selectedClick, setSelectedClick] = useState<CurrentClickRes>();
  function handleSelectedClick(item: CurrentClickRes): void {
    setSelectedClick(item);
  }
  // 설명 팝오버
  const descAnchor = useAnchorEl();

  /**
   * 해당 클릭 객체의 실제 랜딩페이지 URL을 반환합니다. (CPS 광고 분기처리 추가되었습니다.)
   * @param click 클릭 객체
   * @returns 문자열 또는 undefined
   */
  const getLandingUrl = (click: CurrentClickRes): string | undefined => {
    // 판매형 광고의 경우
    if (click.merchandiseId) {
      return click.itemSiteUrl;
    }
    return click.links?.links.find(link => link.primary)?.linkTo;
  };

  return (
    <Paper className={classes.container}>
      <Grid container justify="space-around">
        {/* 클릭 광고 정보 */}
        <Grid item xs={12} sm={6}>
          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>광고 클릭 정보</Typography>

          <Grid container spacing={2} justify="center">
            {/* 클릭 수 정보 */}
            {!clicks.isLoading && clicks.data && (
              <Grid item>
                <div>
                  <Typography>클릭광고 클릭 수</Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {clicks.data.adpanel || 0} 회
                  </Typography>
                </div>
                {/* 210923 온애드 채팅봇 차단으로 인한 제거 처리 by dan(hwasurr) */}
                {/* <div style={{ marginTop: 8 }}>
                  <Typography>채팅광고 클릭 수</Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {clicks.data.adchat || 0} 회
                  </Typography>
                </div> */}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* 최근 광고 클릭 */}
        <Grid item xs={12} sm={6}>
          {/* 모바일화면 DIvider */}
          <Hidden smUp>
            <Divider className={classes.divider} />
          </Hidden>

          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>최근 광고 클릭</Typography>
          {currentClicks.isLoading && <CircularProgress style={{ marginTop: 16 }} />}
          {!currentClicks.isLoading && currentClicks.data && currentClicks.data.length === 0 && (
            <Typography variant="body2" style={{ marginTop: 16 }}>
              최근 광고 클릭 내역이 없어요..
            </Typography>
          )}
          {!currentClicks.isLoading &&
            currentClicks.data &&
            currentClicks.data.map(click => (
              <div key={click.id} style={{ maxWidth: 270 }}>
                <Typography
                  className={classnames(classes.buttonText, classes.line)}
                  variant="body2"
                  onClick={e => {
                    handleSelectedClick(click);
                    descAnchor.handleAnchorOpen(e);
                  }}
                >
                  {click.campaignName}
                </Typography>
                <Typography style={{ cursor: 'default' }} variant="caption" color="textSecondary">
                  {`${renderClickChannel(click.channel)} • `}
                </Typography>
                <Typography style={{ cursor: 'default' }} variant="caption" color="textSecondary">
                  {dayjs(click.clickedTime).fromNow()}
                </Typography>
              </div>
            ))}
          {/* 이전/다음 버튼 */}
          {currentClicks.data && currentClicks.data.length > 0 && (
            <div style={{ display: 'flex' }}>
              <Button
                variant="outlined"
                size="small"
                style={{ maxWidth: 16 }}
                disabled={currentClicksPage <= 0}
                onClick={(): void => {
                  if (currentClicksPage > 0) {
                    handleBack();
                  }
                }}
              >
                이전
              </Button>
              <Button
                variant="outlined"
                size="small"
                style={{ maxWidth: 16 }}
                disabled={!(currentClicks.data && currentClicks.data.length > 2)}
                onClick={(): void => {
                  if (currentClicks.data && currentClicks.data.length > 2) {
                    handleNext();
                  }
                }}
              >
                다음
              </Button>
            </div>
          )}
        </Grid>
      </Grid>

      {/* 최근 광고 클릭 자세히보기 팝오버 */}
      {selectedClick && descAnchor.open && (
        <Popover
          disableScrollLock
          id="mouse-over-popover"
          open={descAnchor.open}
          anchorEl={descAnchor.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={descAnchor.handleAnchorClose}
          disableRestoreFocus
        >
          <div style={{ padding: 8, maxWidth: 300 }}>
            <Chip size="small" label={renderClickChannel(selectedClick.channel)} />
            <div style={{ padding: 4 }}>
              {/* 링크이름 */}
              <Typography variant="body2">{selectedClick.campaignName}</Typography>

              {selectedClick.merchandiseId && (
                <Typography variant="body2" color="primary">
                  판매형 광고클릭
                </Typography>
              )}
              {/* 링크 클릭 수익금 */}
              {selectedClick.payout > 0 && (
                <Typography variant="body2">{`수익금: ${selectedClick.payout} 원`}</Typography>
              )}

              {/* 클릭 정보 */}
              <Typography variant="caption" color="textSecondary">
                {`${selectedClick.os}, ${selectedClick.browser}`}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                window.open(getLandingUrl(selectedClick), '_blank');
              }}
            >
              링크바로가기
            </Button>
          </div>
        </Popover>
      )}
    </Paper>
  );
}
