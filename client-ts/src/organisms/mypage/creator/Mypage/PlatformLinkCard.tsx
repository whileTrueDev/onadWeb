import React from 'react';
import {
  Grid, Typography, Paper, darken,
} from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Check, Refresh, } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useLocation } from 'react-router-dom';
import Button from '../../../../atoms/CustomButtons/Button';

import { ProfileDataType } from './ProfileData.type';
import HOST from '../../../../config';
import { OnadTheme } from '../../../../theme';
import history from '../../../../history';
import { useDialog, useGetRequest } from '../../../../utils/hooks';
import AfreecaLinkDialog from './LinkDialog/AfreecaLinkDialog';
import axiosInstance from '../../../../utils/axios';
import CustomDialog from '../../../../atoms/Dialog/Dialog';

const useStyles = makeStyles((theme: OnadTheme) => ({
  success: { color: theme.palette.success.main },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': { backgroundColor: darken(theme.palette.platform.twitch, 0.15) },
  },
  afreeca: {
    color: theme.palette.getContrastText(theme.palette.platform.afreeca),
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': { backgroundColor: darken(theme.palette.platform.afreeca, 0.15) },
  },
}));

interface PlatformLinkCardProps {
  profileData: ProfileDataType;
  profileRefetch: () => void;
}
export default function PlatformLinkCard({
  profileData,
  profileRefetch,
}: PlatformLinkCardProps): JSX.Element {
  const classes = useStyles();

  // **************************************************
  // 연동 에러 처리
  const location = useLocation();
  function parseLocationParams(): {[key: string]: string} {
    const result: {[key: string]: string} = {};
    if (location.search) {
      location.search.substr(1).split('&').forEach((param) => {
        const [key, value] = param.split('=');
        Object.assign(result, { [key]: value });
      });
    }
    return result;
  }

  const afreecaLinkData = useGetRequest('/link/afreeca');

  // 아프리카 연동 다이얼로그
  const afreecaLinkDialog = useDialog();

  // 아프리카 연동 취소 확인 다이얼로그
  const afreecaCancelConfirmDialog = useDialog();
  // 아프리카 연동 요청 취소 핸들러
  function handleCancel(): void {
    axiosInstance.delete(`${HOST}/link/afreeca`, {
      data: { afreecaId: 'orangene11' }
    })
      .then((res) => {
        if (res.data) {
          afreecaCancelConfirmDialog.handleClose();
          profileRefetch();
        }
      });
  }

  return (
    <Paper style={{ padding: 32 }}>
      <Grid container style={{ paddingBottom: 16 }} alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <Typography style={{ fontWeight: 'bold' }}>플랫폼 연동</Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>광고시작을 위해 플랫폼 연동은 꼭 필요합니다.</Typography>
        </Grid>

        {/* 기존 유저로, 해당하는 creatorId가 이미 creatorInfo에 있는 상황 */}
        {location.search && location.search.includes('error=precreator') && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography variant="body2">기존 트위치 로그인 방식으로 온애드를 사용한 기록이 있습니다.</Typography>
              <Typography variant="body2">꼭! 기존 유저의 새로운 로그인 방식에 따른 새로운 회원가입을 진행하세요!</Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => { history.push('/creator/signup/pre-user'); }}
              >
                기존 계정 로그인하기
              </Button>
            </Alert>
          </Grid>
        )}

        {/* 중복연동으로 실패 알림 */}
        {location.search && location.search.includes('error=alreadyLinked') && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography>이미 해당 아이디에 연동된 유저가 있습니다.</Typography>
              <Typography>혹시 본인의 아이디가 다른 유저에게 잘못 연결되어 있는 경우 문의 부탁드립니다.</Typography>
              <Typography variant="body2">
                {`이미 연동된 유저 아이디: ${parseLocationParams().user ? parseLocationParams().user : ''}`}
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => window.open('http://pf.kakao.com/_xoyxmfT/chat')}
              >
                문의하기
              </Button>
            </Alert>
          </Grid>
        )}

        {/* 트위치 */}
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
          <img alt="" height={35} src="/pngs/logo/twitch/TwitchGlitchPurple.png" style={{ marginRight: 16 }} />
          {!profileData.creatorTwitchOriginalId ? (
            <Button
              variant="contained"
              size="small"
              className={classes.twitch}
              href={`${HOST}/link/twitch`}
            >
              트위치 연동하기
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" size="small" disableElevation style={{ cursor: 'default' }}>
                트위치 연동완료
                <Check className={classes.success} />
              </Button>
              <Typography style={{ marginLeft: 8 }}>
                {`${profileData.creatorName}, ${profileData.creatorTwitchId}`}
              </Typography>
            </div>
          )}
        </Grid>
        {/* 아프리카티비 */}
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
          <img alt="" height={35} src="/pngs/logo/afreeca/onlyFace.png" style={{ marginRight: 16 }} />
          {!profileData.afreecaId ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                className={classes.afreeca}
                onClick={afreecaLinkDialog.handleOpen}
              >
                아프리카TV 연동하기
              </Button>
              {!afreecaLinkData.loading && afreecaLinkData.data
              && (
                <>
                  <Typography style={{ marginLeft: 8 }}>
                    {`${afreecaLinkData.data.afreecaId} 연동 진행중`}
                  </Typography>
                  <MuiButton
                    color="primary"
                    size="small"
                    onClick={(): void => { profileRefetch(); afreecaLinkData.doGetRequest(); }}
                  >
                    새로고침
                    <Refresh fontSize="small" />
                  </MuiButton>
                  <MuiButton
                    color="default"
                    size="small"
                    onClick={afreecaCancelConfirmDialog.handleOpen}
                  >
                    취소하기
                  </MuiButton>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" size="small" disableElevation style={{ cursor: 'default' }}>
                아프리카TV 연동완료
                <Check className={classes.success} />
              </Button>
              <Typography style={{ marginLeft: 8 }}>
                {`${profileData.afreecaName}, ${profileData.afreecaId}`}
              </Typography>
            </div>
          )}
        </Grid>
      </Grid>

      {/* 아프리카 연동 다이얼로그 */}
      <AfreecaLinkDialog
        afreecaLinkData={afreecaLinkData.data}
        afreecaLinkDataRefetch={afreecaLinkData.doGetRequest}
        open={afreecaLinkDialog.open}
        onClose={afreecaLinkDialog.handleClose}
      />

      {/* 아프리카 연동 취소 확인 다이얼로그 */}
      <CustomDialog
        open={afreecaCancelConfirmDialog.open}
        onClose={afreecaCancelConfirmDialog.handleClose}
        title="아프리카TV 연동 취소 확인"
        maxWidth="xs"
        fullWidth
        buttons={(
          <div>
            <Button size="small" onClick={handleCancel} variant="contained" color="primary">확인</Button>
            <Button size="small" onClick={afreecaCancelConfirmDialog.handleClose}>취소</Button>
          </div>
        )}
      >
        <Typography>정말로 취소하시겠습니까?</Typography>
      </CustomDialog>
    </Paper>
  );
}
