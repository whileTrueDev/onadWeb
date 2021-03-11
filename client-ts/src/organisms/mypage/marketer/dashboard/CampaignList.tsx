import React from 'react';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, Divider, Button,
  Typography, IconButton,
  ListItem, List, FormControlLabel,
  Snackbar, Hidden, Switch, CircularProgress
} from '@material-ui/core';

import Countup from 'react-countup';
import CloseIcon from '@material-ui/icons/Close';
import { CampaignInterface } from './interfaces';
import useDialog from '../../../../utils/hooks/useDialog';
import history from '../../../../history';
import axios from '../../../../utils/axios';
import HOST from '../../../../config';
import renderOptionType from '../../../../utils/render_funcs/renderOptionType';
import renderPriorityType from '../../../../utils/render_funcs/renderPriorityType';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import { useGetRequest } from '../../../../utils/hooks';


const useStyles = makeStyles((theme: Theme) => ({
  container: { padding: theme.spacing(2) },
  list: {
    width: '100%',
    '&:hover': { backgroundColor: theme.palette.action.hover }
  },
  img: {
    width: 240,
    height: 120,
    [theme.breakpoints.down('md')]: { width: 120, height: 60 },
    maxWidth: '100%',
  },
  contents: {
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  loading: {
    paddingTop: theme.spacing(3), paddingBottom: theme.spacing(3)
  },
  statement: {
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  },
  url: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '240px'
  },
  moreButton: { margin: theme.spacing(1) }
}));

export default function CampaignList(): JSX.Element {
  const OFFSET = 2;
  const classes = useStyles();

  const campaignData = useGetRequest<{page: number; offset: number}, CampaignInterface[]>(
    '/marketer/campaign/list', { page: 0, offset: OFFSET }
  );

  const snack = useDialog();

  // useUpdateData를 사용할 때, 전달되는 url router의 response data의 형태가 array여야함을 고려한다.
  const handleUpdateState = (
    { onoffState, campaignId }: { onoffState: boolean; campaignId: string }
  ) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();

    axios.patch(`${HOST}/marketer/campaign/on-off`, { onoffState, campaignId })
      .then((res) => {
        if (res.data[0]) {
          if (campaignData.data) {
            const target = campaignData.data.findIndex((x) => x.campaignId === campaignId);
            if (target > -1) {
              const tmpList = campaignData.data;
              const tmp = campaignData.data[target];
              tmp.onOff = !tmp.onOff ? 1 : 0;

              tmpList[target] = tmp;
              campaignData.setData(tmpList);
            }
          }
          snack.handleOpen();
        } else {
          alert(res.data[1]);
        }
      });
    // doPatchRequest({ onoffState, campaignId });
  };

  const confirmCases = (state: number) => {
    switch (state) {
      case 0: return (
        <Typography gutterBottom variant="body2" color="secondary" align="center">
          승인 대기
          <span role="img" aria-label="clock-mark">⏰</span>
        </Typography>
      );
      case 1: return (
        <Typography gutterBottom variant="body2" color="primary" align="center">
          승인 완료
          <span role="img" aria-label="ok-mark">👌</span>
        </Typography>
      );

      case 2: return (
        <Typography style={{ color: 'red' }} gutterBottom variant="body2" align="center">승인 거절</Typography>
      );
      default: throw new Error('you need confirmState for table');
    }
  };


  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          캠페인 목록
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={(): void => { history.push('/mypage/marketer/campaigncreate'); }}
        >
          캠페인 등록하기
        </Button>
      </div>

      <Divider />
      {campaignData.data && (
        <List>
          {campaignData.data.map((detail: CampaignInterface, index) => (
            <div key={detail.campaignId}>
              <ListItem className={classes.list}>
                <Grid container direction="row" justify="space-between">
                  <Grid item className={classes.contents}>
                    <Grid container direction="row" className={classes.contents} spacing={3}>
                      <Grid item>
                        <FormControlLabel
                          control={(
                            <Switch
                              id="onoff-switch"
                              color="primary"
                              checked={Boolean(detail.onOff)}
                              onChange={handleUpdateState({
                                onoffState: !detail.onOff,
                                campaignId: detail.campaignId
                              })}
                            />
                          )}
                          label={detail.onOff
                            ? (<Typography color="primary">활성화</Typography>)
                            : (<Typography>비활성화</Typography>)}
                          labelPlacement="bottom"
                        />
                      </Grid>
                      <Grid item>
                        <OnadBanner className={classes.img} alt="campaign-logo" src={detail.bannerSrc} />
                      </Grid>
                      <Hidden xsDown>
                        <Grid item>
                          <Grid container direction="column" spacing={2}>
                            <Typography gutterBottom variant="body2">
                              {detail.campaignName}
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                              {`${renderOptionType(detail.optionType)} • ${renderPriorityType(detail.priorityType)}`}
                            </Typography>
                            {detail.campaignDescription && (
                            <Typography variant="caption" gutterBottom noWrap>
                              {detail.campaignDescription.slice(0, 20)}
                            </Typography>
                            )}
                            <Typography variant="caption" color="textSecondary">
                              {moment(detail.regiDate).format('YYYY-MM-DD HH:mm:ss')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Hidden>
                    </Grid>
                  </Grid>
                  <Hidden mdDown>
                    <Grid item>
                      <Grid container direction="column" spacing={2}>
                        {detail.linkId && detail.linkData
                          && detail.linkData.links
                            .map((link): JSX.Element | null => (
                              <Grid item key={link.linkName}>
                                {link.linkName && (
                                  <>
                                    <Typography variant="body1" color="primary" align="center">
                                  링크 이름
                                    </Typography>
                                    <Divider orientation="horizontal" />
                                    <Typography gutterBottom variant="body2" align="center">
                                      {link.linkName}
                                    </Typography>
                                  </>
                                )}
                                <Typography variant="body1" color="primary" align="center">
                                  URL 주소
                                </Typography>
                                <Divider orientation="horizontal" />
                                <Typography className={classes.url} gutterBottom variant="body2" align="center">
                                  {link.linkTo}
                                </Typography>
                                <Divider orientation="horizontal" />
                                {detail.linkConfirmState && (
                                  <>
                                    {confirmCases(detail.linkConfirmState)}
                                  </>
                                )}
                              </Grid>
                            ))}
                      </Grid>
                    </Grid>
                  </Hidden>
                  <Hidden mdDown>
                    <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography gutterBottom variant="body2">
                            오늘 집행된 예산
                          </Typography>
                        </Grid>
                        <Grid>
                          <Divider orientation="horizontal" />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5" color="secondary" align="center">
                            <Countup duration={2} end={detail.dailysum ? detail.dailysum : 0} separator="," />
                          </Typography>
                        </Grid>
                        <Grid item>
                          {(detail.dailyLimit !== -1)
                            ? (
                              <Typography variant="body1" align="center" style={{ fontWeight: 700 }}>
                                {new Intl.NumberFormat().format(detail.dailyLimit)}
                              </Typography>
                            ) : (
                              <Typography variant="h4" align="center" style={{ fontWeight: 700 }}>
                                ∞
                              </Typography>
                            )}
                        </Grid>
                        <Grid>
                          <Divider orientation="horizontal" />
                        </Grid>
                        <Grid item>
                          <Typography gutterBottom variant="body2" align="center">
                            일일 예산
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Hidden>
                </Grid>
              </ListItem>
              {(campaignData.data
                && !(campaignData.data.length - 1 === index)) && (<Divider light />)}
            </div>
          ))}

          {/* 캠페인 목록이 있고, 캠페인 갯수가 offset 으로 나누었을 때 나머지가 0인 경우  */}
          {campaignData.data.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <Button
              className={classes.moreButton}
              variant="contained"
              color="primary"
              onClick={() => {
                history.push('/mypage/marketer/inventory');
              }}
            >
              더보기
            </Button>
          </div>
          )}
        </List>
      )}
      {(!campaignData.loading && campaignData.data && campaignData.data.length === 0) && (
        <Grid container justify="center" alignItems="center" direction="column" style={{ marginTop: 40 }}>
          <Typography variant="body1">생성된 캠페인이 없습니다.</Typography>
          <Typography variant="body1">새로운 캠페인을 생성해 광고를 진행하세요.</Typography>
        </Grid>
      )}
      {(campaignData.loading) && (
      <Grid item xs={12} className={classes.loading}>
        <Typography className={classes.statement}>
            캠페인 목록을 로드하고 있습니다.
        </Typography>
        <div style={{ textAlign: 'center' }}><CircularProgress /></div>
      </Grid>
      )}


      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snack.open}
        autoHideDuration={400}
        onClose={(): void => {
          snack.handleClose();
        }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        // variant="success"
        message={<Typography id="message-id">성공적으로 반영되었습니다.</Typography>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={snack.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />

    </Paper>
  );
}
