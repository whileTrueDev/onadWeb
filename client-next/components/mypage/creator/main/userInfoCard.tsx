import { Avatar, Box, Chip, Divider, Grow, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import Button from '../../../../atoms/button/customButton';
import CenterLoading from '../../../../atoms/loading/centerLoading';
import { useCreatorClickStartCheck } from '../../../../utils/hooks/query/useCreatorBannerStartCheck';
import { useCreatorBannerStartCheck } from '../../../../utils/hooks/query/useCreatorClickStartCheck';
import { useCreatorIncome } from '../../../../utils/hooks/query/useCreatorIncome';
import { useCreatorIncomeWithdrawal } from '../../../../utils/hooks/query/useCreatorIncomeWithdrawal';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';

dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
  flex: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: {
    minHeight: 400,
    marginTop: theme.spacing(1),
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  avatar: {
    width: 100,
    height: 100,
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
    [theme.breakpoints.down('xs')]: {
      width: 40,
      height: 40,
    },
  },
  bold: { fontWeight: 'bold' },
  chip: {
    marginRight: theme.spacing(1) / 2,
    marginTop: theme.spacing(1) / 2,
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  error: { backgroundColor: theme.palette.error.main },
  black: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  info: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  secondary: { backgroundColor: theme.palette.secondary.main },
  infoSection: { display: 'flex', alignItems: 'center' },
  section: { textAlign: 'right', margin: theme.spacing(1) },
  withdrawalSection: { margin: theme.spacing(1), marginTop: theme.spacing(2), overflowY: 'auto' },
  withdrawalItem: { display: 'flex', justifyContent: 'space-between', padding: '4px 0px' },
  withdrawalChip: { marginLeft: theme.spacing(1) },
  right: { textAlign: 'right' },
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
}));
export interface WithdrawalRes {
  date: string;
  creatorWithdrawalAmount: number;
  withdrawalState: number;
}
interface UserInfoCardProps {
  handleWithdrawalDialogOpen: () => void;
}
const UserInfoCard = ({ handleWithdrawalDialogOpen }: UserInfoCardProps): JSX.Element => {
  const classes = useStyles();
  const profile = useCreatorProfile();
  const income = useCreatorIncome();
  const withdrawal = useCreatorIncomeWithdrawal();
  // 배너 광고 첫 수익 여부 정보
  const bannerAdStart = useCreatorBannerStartCheck();
  // 클릭 광고 첫 수익 여부 정보
  const clickAdStart = useCreatorClickStartCheck();
  const router = useRouter();

  function getSettlementString(settlementState: number): string {
    let result;
    switch (settlementState) {
      case 0:
        result = '정산등록 필요';
        break;
      case 1:
        result = '정산등록 승인대기';
        break;
      case 2:
        result = '정산등록 승인완료';
        break;
      default:
        result = '정산등록 반려';
        break;
    }
    return result;
  }

  if (profile.isLoading) return <CenterLoading />;
  if (!profile.data) return <div />;

  return (
    <Paper className={classes.container}>
      {/* 유저 정보 섹션 */}
      <div className={classes.infoSection}>
        <Avatar
          variant="circular"
          className={classes.avatar}
          src={profile.data.creatorLogo || profile.data.afreecaLogo || ''}
        />
        <div>
          <div>
            <Typography variant="h5" className={classes.bold}>
              {profile.data.loginId}
              &nbsp;
              {profile.data.afreecaId && (
                <img
                  alt=""
                  height={25}
                  src="/logo/afreeca/onlyFace.png"
                  style={{ marginRight: 8 }}
                />
              )}
              {profile.data.creatorTwitchOriginalId && (
                <img
                  alt=""
                  height={25}
                  src="/logo/twitch/TwitchGlitchPurple.png"
                  style={{ marginRight: 8 }}
                />
              )}
            </Typography>
            <Typography variant="body2">
              {`${profile.data.creatorName || profile.data.afreecaName || ''} ${
                profile.data.creatorMail || profile.data.afreecaId || ''
              }`}
            </Typography>
          </div>
          {/* 상태 칩 섹션 */}
          <Grow in>
            <Chip
              className={classes.chip}
              size="small"
              color="primary"
              label={
                profile.data.creatorContractionAgreement === 1 ? '이용 동의완료' : '이용 미동의'
              }
            />
          </Grow>
          <Grow in>
            <Chip
              className={classnames(classes.chip, classes.success)}
              size="small"
              label={getSettlementString(profile.data.settlementState)}
            />
          </Grow>
          {/* 한번이라도 배너 송출 로그가 찍혀있는 경우 설정 완료로 처리 */}
          {!bannerAdStart.isLoading && bannerAdStart.data && (
            <Grow in>
              <Chip
                className={classnames(classes.chip)}
                size="small"
                color="secondary"
                label="배너광고 첫수익달성"
              />
            </Grow>
          )}
          {/* 클릭 로그가 찍혀 있는 경우  처리 */}
          {!clickAdStart.isLoading && clickAdStart.data && (
            <Grow in>
              <Chip
                className={classnames(classes.chip, classes.info)}
                size="small"
                label="클릭광고 첫수익달성"
              />
            </Grow>
          )}
        </div>
      </div>

      {/* 수익금 섹션 */}
      <div className={classes.section}>
        <Typography gutterBottom variant="body1">
          출금가능한 수익금
        </Typography>

        {income.isLoading && <CenterLoading />}
        {!income.isLoading && income.data && (
          <Box>
            <Typography gutterBottom variant="h4" className={classes.bold}>
              <Typography component="span" variant="body2" color="textSecondary">
                {`누적 수익 ${income.data.creatorTotalIncome.toLocaleString()}원`}
              </Typography>
              &nbsp;
              {`${income.data.creatorReceivable.toLocaleString()} 원`}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              {`최근 수익 반영: ${dayjs(income.data.date).fromNow()}`}
            </Typography>
          </Box>
        )}

        {income.data && income.data.creatorAccountNumber && income.data.creatorReceivable > 0 && (
          <div className={classes.right}>
            <Button
              color="primary"
              size="small"
              onClick={(): void => {
                handleWithdrawalDialogOpen();
              }}
            >
              출금신청
            </Button>
          </div>
        )}
      </div>

      <Divider />

      <div className={classes.withdrawalSection}>
        {withdrawal.isLoading && <CenterLoading height={25} />}

        {!withdrawal.isLoading && (!withdrawal.data || withdrawal.data.length === 0) && (
          <div className={classes.flex} style={{ marginTop: 32 }}>
            <Typography variant="body2" className={classes.ellipsis}>
              아직 출금 신청 내역이 없어요..
            </Typography>
          </div>
        )}
        {withdrawal.data &&
          withdrawal.data.slice(0, 2).map(withdrawalRequest => (
            <div className={classes.withdrawalItem} key={nanoid()}>
              <Typography className={classes.ellipsis}>
                {`${withdrawalRequest.creatorWithdrawalAmount.toLocaleString()}원 출금신청 `}
                <Typography component="span" variant="caption" color="textSecondary">
                  {dayjs(withdrawalRequest.date).format('YYYY년 MM월 DD일')}
                </Typography>
              </Typography>
              <Chip
                size="small"
                className={classnames({
                  [classes.chip]: true,
                  [classes.success]: withdrawalRequest.withdrawalState === 1,
                  [classes.info]: withdrawalRequest.withdrawalState === 0,
                  [classes.withdrawalChip]: true,
                })}
                label={withdrawalRequest.withdrawalState === 1 ? '정산 완료' : '정산 예정'}
              />
            </div>
          ))}
        {withdrawal.data && !(withdrawal.data.length === 0) && (
          <div className={classes.right}>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.moreButton}
              onClick={(): void => {
                router.push('/mypage/creator/income');
              }}
            >
              자세히 보기
            </Typography>
          </div>
        )}
      </div>
    </Paper>
  );
};

export default UserInfoCard;
