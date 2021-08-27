import {
  Button,
  CircularProgress,
  Hidden,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import ReferralCodeEventDialog from '../../../components/shared/referralCodeEventDialog';
import copyToClipboard from '../../../utils/copyToClipboard';
import { useDialog } from '../../../utils/hooks';
import { useCreatorReferralCode } from '../../../utils/hooks/query/useCreatorReferralCode';
import DashboardLayout from '../../../components/mypage/layouts/creatorDashboardLayout';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1024 },
  paper: { padding: theme.spacing(4) },
  bold: { fontWeight: 'bold' },
  contentsSpace: { marginTop: theme.spacing(2) },
  contents: { display: 'flex', maxWidth: 400 },
  textfield: { marginRight: theme.spacing(1) },
  successIcon: { color: theme.palette.success.main },
}));

export interface ReferralCodeRes {
  referralCode: string;
  createdAt: string;
  calculateState?: number; // 0, 1, 2
  calculatedAt?: string;
  creatorName?: string;
  afreecaName?: string;
  loginId?: string;
  creatorContractionAgreement: number; // 0, 1
}

const CALCULATE_DONE_STATE = 2;
export default function ReferralCodeManage(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const referralCode = useCreatorReferralCode();

  // **************************************************
  // 리뉴얼 추가 작업 - 리뉴얼 알림창 및 크리에이터 로그인 다이얼로그 오픈 토글
  // 크리에이터 로그인창
  // 리뉴얼 알림 창
  const eventDialog = useDialog();
  useEffect(() => {
    const now = new Date();
    const noShowDateString = localStorage.getItem('renewal-popup-no-show');
    if (noShowDateString) {
      const noShowDate = new Date(noShowDateString);
      const ONE_DAY = 1000 * 60 * 60 * 24;
      // 다시 보지 않기 클릭 이후 24시간이 지나지 않은 경우 열리지 않게
      if (now.getTime() - noShowDate.getTime() > ONE_DAY) {
        eventDialog.handleOpen();
      }
    } else {
      // 다시보지않기를 한번도 누르지 않은 경우
      eventDialog.handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Typography>내 추천인 코드</Typography>
        <Typography variant="body2" color="textSecondary">
          * 추천인 코드는 1회만 사용 가능합니다.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          * 추천인 코드를 다른 방송인에게 전달한 뒤, 전달받은 방송인이 온애드 가입 및 아프리카TV
          연동시 수익금 5,000원이 적립됩니다.
        </Typography>

        <div className={classnames(classes.contentsSpace, classes.contents)}>
          {referralCode.isLoading && <CircularProgress />}
          {!referralCode.isLoading && referralCode.data && (
            <>
              {referralCode.data.creatorContractionAgreement === 0 ? (
                <Alert severity="error">
                  <Typography variant="body2">
                    아직 온애드 이용동의를 마치지 않아 사용할 수 없습니다.
                  </Typography>
                  <Typography variant="body2">
                    대시보드에서 [시작하기]를 통해 이용동의를 진행해주세요.
                  </Typography>
                </Alert>
              ) : (
                <>
                  <TextField
                    value={referralCode.data.referralCode}
                    className={classes.textfield}
                    fullWidth
                    variant="outlined"
                    id="referral-code-textfield"
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled={referralCode.data.calculateState === CALCULATE_DONE_STATE}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={e =>
                      copyToClipboard(e, 'referral-code-textfield', () => {
                        enqueueSnackbar('추천인 코드가 복사되었습니다.', { variant: 'success' });
                      })
                    }
                    disabled={referralCode.data.calculateState === CALCULATE_DONE_STATE}
                  >
                    복사
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {referralCode.data && Boolean(referralCode.data.calculateState) && (
          <div className={classes.contentsSpace}>
            {referralCode.data.calculateState === CALCULATE_DONE_STATE && (
              <div>
                <Typography>
                  <CheckCircle fontSize="small" className={classes.successIcon} />
                  {`사용 완료(수익금 지급 완료) - ${
                    referralCode.data.creatorName && referralCode.data.afreecaName
                      ? `${referralCode.data.creatorName}(${referralCode.data.afreecaName})`
                      : referralCode.data.creatorName ||
                        referralCode.data.afreecaName ||
                        referralCode.data.loginId
                  }`}
                </Typography>

                <Typography variant="body2">
                  {dayjs(referralCode.data.calculatedAt).format('YYYY년 MM월 DD일 HH:mm:ss')}
                </Typography>
              </div>
            )}
          </div>
        )}
      </Paper>

      {/* 온애드 리뉴얼 관련 임시 팝업  */}
      <Hidden xsDown>
        <ReferralCodeEventDialog open={eventDialog.open} onClose={eventDialog.handleClose} />
      </Hidden>
    </div>
  );
}

ReferralCodeManage.layout = DashboardLayout;
