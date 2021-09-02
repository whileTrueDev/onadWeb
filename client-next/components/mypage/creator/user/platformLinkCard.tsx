import { darken, Grid, Paper, Typography } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Check, Refresh } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import Button from '../../../../atoms/button/customButton';
import CustomDialog from '../../../../atoms/dialog/dialog';
import CenterLoading from '../../../../atoms/loading/centerLoading';
import HOST from '../../../../config';
import { OnadTheme } from '../../../../theme';
import { useDialog, useEventTargetValue } from '../../../../utils/hooks';
import { useCreatorDeleteLinkAfreecaCertMutation } from '../../../../utils/hooks/mutation/useCreatorDeleteLinkAfreecaCertMutation';
import { useCreatorDeleteLinkAfreecaMutation } from '../../../../utils/hooks/mutation/useCreatorDeleteLinkAfreecaMutation';
import { useCreatorDeleteLinkTwitchMutation } from '../../../../utils/hooks/mutation/useCreatorDeleteLinkTwitchMutation';
import { useCreatorLinkAfreecaCert } from '../../../../utils/hooks/query/useCreatorLinkAfreecaCert';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
import openKakaoChat from '../../../../utils/openKakaoChat';
import AfreecaLinkDialog from './linkDialog/afreecaLinkDialog';

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

export default function PlatformLinkCard(): JSX.Element {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  // 프로필 유저 데이터
  const profile = useCreatorProfile();

  // **************************************************
  // 연동 에러 처리
  function parseLocationParams() {
    const result: { [key: string]: string } = {};
    if (router.query) {
      Object.assign(result, router.query);
    }
    return result;
  }

  // *********************************************
  // 연동하고자 하는 아프리카 ID (사용자입력)
  const afreecaId = useEventTargetValue();

  const afreecaLink = useCreatorLinkAfreecaCert();

  // 아프리카 연동 다이얼로그
  const afreecaLinkDialog = useDialog();

  // 아프리카 연동 취소 확인 다이얼로그
  const afreecaCancelConfirmDialog = useDialog();
  const deleteCert = useCreatorDeleteLinkAfreecaCertMutation();
  // 아프리카 연동 요청 취소 핸들러
  function handleCancel(): void {
    deleteCert.mutateAsync({ afreecaId: afreecaId.value }).then(res => {
      if (res.data) {
        afreecaCancelConfirmDialog.handleClose();
      }
    });
  }

  // 아프리카 연동 상태 다이얼로그
  const afreecaLinkDeleteDialog = useDialog();
  const deleteLinkAfreeca = useCreatorDeleteLinkAfreecaMutation();
  // 아프리카 연동 해제
  function handleDeleteLinkAfreeca(): void {
    deleteLinkAfreeca
      .mutateAsync()
      .then(res => {
        if (res.data) {
          afreecaLinkDeleteDialog.handleClose();
          enqueueSnackbar('성공적으로 연동이 해제 되었습니다.', { variant: 'success' });
        }
      })
      .catch(err => {
        enqueueSnackbar('연동 해제 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
          variant: 'error',
        });
        console.error(err);
      });
  }

  // ************************************************
  // 트위치 연동 해제
  const twitchLinkDeleteDialog = useDialog();
  const deleteLinkTwitch = useCreatorDeleteLinkTwitchMutation();
  function handleDeleteLinkTwitch(): void {
    deleteLinkTwitch
      .mutateAsync()
      .then(res => {
        if (res.data) {
          twitchLinkDeleteDialog.handleClose();
          enqueueSnackbar('성공적으로 연동이 해제 되었습니다.', { variant: 'success' });
        }
      })
      .catch(err => {
        enqueueSnackbar('연동 해제 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
          variant: 'error',
        });
        console.error(err);
      });
  }

  if (profile.isLoading) return <CenterLoading />;
  if (!profile.data) return <div />;

  return (
    <Paper style={{ padding: 32 }}>
      <Grid container style={{ paddingBottom: 16 }} alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <Typography style={{ fontWeight: 'bold' }}>플랫폼 연동</Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            광고시작을 위해 플랫폼 연동은 꼭 필요합니다.
          </Typography>
        </Grid>

        {/* 기존 유저로, 해당하는 creatorId가 이미 creatorInfo에 있는 상황 */}
        {router.asPath && router.asPath.includes('error=precreator') && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography variant="body2">
                기존 트위치 로그인 방식으로 온애드를 사용한 기록이 있습니다.
              </Typography>
              <Typography variant="body2">
                꼭! 기존 유저의 새로운 로그인 방식에 따른 새로운 회원가입을 진행하세요!
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  router.push('/regist/pre-user');
                }}
              >
                기존 계정 로그인하기
              </Button>
            </Alert>
          </Grid>
        )}

        {/* 중복연동으로 실패 알림 */}
        {router.asPath && router.asPath.includes('error=alreadyLinked') && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography>이미 해당 아이디에 연동된 유저가 있습니다.</Typography>
              <Typography>
                혹시 본인의 아이디가 다른 유저에게 잘못 연결되어 있는 경우 문의 부탁드립니다.
              </Typography>
              <Typography variant="body2">
                {`이미 연동된 유저 아이디: ${
                  parseLocationParams().user ? parseLocationParams().user : ''
                }`}
              </Typography>
              <Button size="small" variant="contained" color="primary" onClick={openKakaoChat}>
                문의하기
              </Button>
            </Alert>
          </Grid>
        )}

        {/* 트위치 */}
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
          <img
            alt=""
            height={35}
            src="/logo/twitch/TwitchGlitchPurple.png"
            style={{ marginRight: 16 }}
          />
          {!profile.data?.creatorTwitchOriginalId ? (
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
              <Button
                variant="contained"
                size="small"
                disableElevation
                style={{ cursor: 'default' }}
              >
                트위치 연동완료
                <Check className={classes.success} />
              </Button>
              {profile.data && (
                <Typography style={{ marginLeft: 8 }}>
                  {`${profile.data.creatorName}, ${profile.data.creatorTwitchId}`}
                </Typography>
              )}
              <Button
                size="small"
                variant="text"
                style={{ textDecoration: 'underline' }}
                onClick={twitchLinkDeleteDialog.handleOpen}
              >
                연동해제
              </Button>
            </div>
          )}
        </Grid>
        {/* 아프리카티비 */}
        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
          <img alt="" height={35} src="/logo/afreeca/onlyFace.png" style={{ marginRight: 16 }} />
          {!profile.data?.afreecaId ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                className={classes.afreeca}
                onClick={afreecaLinkDialog.handleOpen}
              >
                아프리카TV 연동하기
              </Button>
              {!afreecaLink.isLoading && afreecaLink.data && (
                <>
                  <Typography style={{ marginLeft: 8 }}>
                    {`${afreecaLink.data.afreecaId} 연동 진행중`}
                  </Typography>
                  <MuiButton
                    color="primary"
                    size="small"
                    onClick={(): void => {
                      queryClient.invalidateQueries('creatorProfile');
                      queryClient.invalidateQueries('creatorLinkAfreecaCert');
                    }}
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
              <Button
                variant="contained"
                size="small"
                disableElevation
                style={{ cursor: 'default' }}
              >
                아프리카TV 연동완료
                <Check className={classes.success} />
              </Button>
              {profile.data && (
                <Typography style={{ marginLeft: 8 }}>
                  {`${profile.data.afreecaName}, ${profile.data.afreecaId}`}
                </Typography>
              )}
              <Button
                size="small"
                variant="text"
                style={{ textDecoration: 'underline' }}
                onClick={afreecaLinkDeleteDialog.handleOpen}
              >
                연동해제
              </Button>
            </div>
          )}
        </Grid>
      </Grid>

      {/* 아프리카 연동진행 다이얼로그 */}
      <AfreecaLinkDialog
        afreecaId={afreecaId}
        open={afreecaLinkDialog.open}
        onClose={afreecaLinkDialog.handleClose}
      />

      {/* 아프리카 연동진행 취소 확인 다이얼로그 */}
      <CustomDialog
        open={afreecaCancelConfirmDialog.open}
        onClose={afreecaCancelConfirmDialog.handleClose}
        title="아프리카TV 연동 취소 확인"
        maxWidth="xs"
        fullWidth
        buttons={
          <div>
            <Button size="small" onClick={handleCancel} variant="contained" color="primary">
              확인
            </Button>
            <Button size="small" onClick={afreecaCancelConfirmDialog.handleClose}>
              취소
            </Button>
          </div>
        }
      >
        <Typography>정말로 취소하시겠습니까?</Typography>
      </CustomDialog>

      {/* 아프리카 연동 해제 확인 다이얼로그 */}
      {profile.data && profile.data.afreecaId && (
        <CustomDialog
          open={afreecaLinkDeleteDialog.open}
          onClose={afreecaLinkDeleteDialog.handleClose}
          title="아프리카TV 연동 해제 확인"
          maxWidth="xs"
          fullWidth
          buttons={
            <div>
              <Button
                size="small"
                onClick={handleDeleteLinkAfreeca}
                variant="contained"
                color="primary"
              >
                확인
              </Button>
              <Button size="small" onClick={afreecaLinkDeleteDialog.handleClose}>
                취소
              </Button>
            </div>
          }
        >
          <Typography>정말로 아프리카TV연동을 해제하시겠습니까?</Typography>
        </CustomDialog>
      )}

      {/* 트위치 연동 해제 확인 다이얼로그 */}
      {profile.data && profile.data.creatorTwitchOriginalId && (
        <CustomDialog
          open={twitchLinkDeleteDialog.open}
          onClose={twitchLinkDeleteDialog.handleClose}
          title="Twitch 연동 해제 확인"
          maxWidth="xs"
          fullWidth
          buttons={
            <div>
              <Button
                size="small"
                onClick={handleDeleteLinkTwitch}
                variant="contained"
                color="primary"
              >
                확인
              </Button>
              <Button size="small" onClick={twitchLinkDeleteDialog.handleClose}>
                취소
              </Button>
            </div>
          }
        >
          <Typography>정말로 Twitch 연동을 해제하시겠습니까?</Typography>
        </CustomDialog>
      )}
    </Paper>
  );
}
