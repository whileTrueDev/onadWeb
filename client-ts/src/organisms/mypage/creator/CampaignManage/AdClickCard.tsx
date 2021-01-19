import moment from 'moment';
import classnames from 'classnames';
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid, Hidden, makeStyles, Paper, Popover, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import useGetRequest, { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { useAnchorEl } from '../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
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
    }
  },
  line: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  buttonText: { cursor: 'pointer', '&:hover': { textDecoration: 'underline', }, }
}));

interface LevelRes { creatorId: string; level: number; exp: number }
interface ClicksRes { adpanel: number; adchat: number }
export interface CurrentClickRes {
  id: string; clickedTime: string; costType: string; linkId: string;
  campaignName: string;
  creatorId: string; payout: number; channel: string;
  os: string; browser: string;
  links: {
    links: Array<{ primary: boolean; linkTo: string; linkName: string }>;
  };
}
export interface AdClickCardProps {
  clicksSummaryData: UseGetRequestObject<ClicksRes>;
  levelData: UseGetRequestObject<LevelRes>;
}
export default function AdClickCard({
  clicksSummaryData,
  levelData,
}: AdClickCardProps): JSX.Element {
  const classes = useStyles();

  const [currentClicksPage, setCurrentClicksPage] = useState(0);
  function handleNext(): void{
    setCurrentClicksPage((prev) => prev + 1);
  }
  function handleBack(): void{
    if (currentClicksPage > 0) {
      setCurrentClicksPage((prev) => prev - 1);
    }
  }
  // 최근 클릭 로그 조회
  const CURRENT_CLICK_OFFSET = 3;
  const currentClickGet = useGetRequest<{offset: number; page: number}, CurrentClickRes[]>(
    '/creator/clicks/current', { offset: CURRENT_CLICK_OFFSET, page: 0 }
  );

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

  return (
    <Paper className={classes.container}>
      <Grid container justify="space-around">

        {/* 클릭 광고 정보 */}
        <Grid item xs={12} sm={6}>
          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>광고 클릭 정보</Typography>

          <Grid container spacing={2} justify="center">
            {/* 레벨 / 경험치 정보 */}
            {!levelData.loading && levelData.data && (
            <Grid item>
              <div style={{ marginBottom: 8, }}>
                <Typography>광고 레벨</Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {`Lv. ${levelData.data.level}`}
                </Typography>
              </div>
              <div style={{ marginTop: 8 }}>
                <Typography>광고 경험치</Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {levelData.data.exp || 0}
                </Typography>
              </div>
            </Grid>
            )}

            {/* 클릭 수 정보 */}
            {!clicksSummaryData.loading && clicksSummaryData.data && (
            <Grid item>
              <div style={{ marginBottom: 8, }}>
                <Typography>클릭광고 클릭 수</Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {clicksSummaryData.data.adpanel || 0}
                  {' '}
                  회
                </Typography>
              </div>
              <div style={{ marginTop: 8 }}>
                <Typography>채팅광고 클릭 수</Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {clicksSummaryData.data.adchat || 0}
                  {' '}
                  회
                </Typography>
              </div>
            </Grid>
            )}
          </Grid>

        </Grid>

        {/* 최근 광고 클릭 */}
        <Grid item xs={12} sm={6}>

          {/* 모바일화면 DIvider */}
          <Hidden smUp><Divider className={classes.divider} /></Hidden>

          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>
            최근 광고 클릭
          </Typography>
          {currentClickGet.loading && (<CircularProgress style={{ marginTop: 16 }} />)}
          {!currentClickGet.loading && currentClickGet.data
          && currentClickGet.data.length === 0 && (
            <Typography variant="body2" style={{ marginTop: 16 }}>최근 광고 클릭 내역이 없어요..</Typography>
          )}
          {!currentClickGet.loading && currentClickGet.data && currentClickGet.data.map((click) => (
            <div key={click.id} style={{ maxWidth: 270 }}>
              <Typography
                className={classnames(classes.buttonText, classes.line)}
                variant="body2"
                onClick={(e) => {
                  handleSelectedClick(click);
                  descAnchor.handleAnchorOpen(e);
                }}
              >
                {`${click.links.links.find((link) => link.primary)?.linkName}`}

              </Typography>
              <Typography style={{ cursor: 'default' }} variant="caption" color="textSecondary">{`${renderClickChannel(click.channel)} • `}</Typography>
              <Typography style={{ cursor: 'default' }} variant="caption" color="textSecondary">{moment(click.clickedTime).fromNow()}</Typography>
            </div>
          ))}
          {/* 이전/다음 버튼 */}
          {currentClickGet.data && currentClickGet.data.length > 0 && (
            <div style={{ display: 'flex', }}>
              <Button
                variant="contained"
                size="small"
                style={{ maxWidth: 16 }}
                disabled={currentClicksPage <= 0}
                onClick={(): void => {
                  if (currentClicksPage > 0) {
                    handleBack();
                    currentClickGet.doGetRequest({
                      offset: CURRENT_CLICK_OFFSET,
                      page: currentClicksPage - 1
                    });
                  }
                }}
              >
                이전
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ maxWidth: 16 }}
                disabled={!(currentClickGet.data && currentClickGet.data.length > 2)}
                onClick={(): void => {
                  if (currentClickGet.data && currentClickGet.data.length > 2) {
                    handleNext();
                    currentClickGet.doGetRequest({
                      offset: CURRENT_CLICK_OFFSET,
                      page: currentClicksPage + 1
                    });
                  }
                }}
              >
                다음
              </Button>
            </div>
          )}
        </Grid>
      </Grid>

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
        <div style={{ padding: 8, maxWidth: 300, }}>
          <Chip size="small" label={renderClickChannel(selectedClick.channel)} />
          <div style={{ padding: 4 }}>
            <Typography variant="body2">
              {`${selectedClick.links.links.find((link) => link.primary)?.linkName}`}
            </Typography>
            {selectedClick.payout > 0 && (
            <Typography variant="body2">{`수익금: ${selectedClick.payout} 원`}</Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              {`${selectedClick.os}, ${selectedClick.browser}`}
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.open(`${selectedClick.links.links.find((link) => link.primary)?.linkTo}`);
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
