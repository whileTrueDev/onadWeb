import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Divider, Paper, Avatar, Chip, Grow
} from '@material-ui/core';
import shortid from 'shortid';
import Button from '../../../../atoms/CustomButtons/Button';
import { useGetRequest } from '../../../../utils/hooks';
import history from '../../../../history';
import { ContractionDataType } from '../../../../pages/mypage/creator/CPAManage';

const useStyles = makeStyles((theme) => ({
  flex: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: {
    minHeight: 400,
    marginTop: theme.spacing(1),
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1)
    }
  },
  avatar: {
    width: 100,
    height: 100,
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
    [theme.breakpoints.down('xs')]: {
      width: 40, height: 40
    }
  },
  bold: { fontWeight: 'bold' },
  chip: {
    marginRight: theme.spacing(1) / 2,
    marginTop: theme.spacing(1) / 2,
    color: theme.palette.common.white,
  },
  success: { backgroundColor: theme.palette.success.main, },
  error: { backgroundColor: theme.palette.error.main },
  black: { backgroundColor: theme.palette.common.black },
  info: { backgroundColor: theme.palette.info.main },
  secondary: { backgroundColor: theme.palette.secondary.main },
  infoSection: { display: 'flex', alignItems: 'center' },
  section: { textAlign: 'right', margin: theme.spacing(1) },
  withdrawalSection: { margin: theme.spacing(1), marginTop: theme.spacing(2), overflowY: 'auto' },
  withdrawalItem: { display: 'flex', justifyContent: 'space-between', padding: '4px 0px' },
  withdrawalChip: { marginLeft: theme.spacing(1) },
  right: { textAlign: 'right' },
  ellipsis: {
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline', }
  },
}));
export interface WithdrawalRes {
  date: string;
  creatorWithdrawalAmount: number;
  withdrawalState: number;
}
export interface IncomeCashRes {
  creatorTotalIncome: number;
  creatorReceivable: number;
  creatorAccountNumber: string;
  date: string;
  creatorContractionAgreement: number;
  realName: string;
  settlementState: number;
}
interface UserInfoCardProps {
  userProfileData: ContractionDataType;
  incomeData: IncomeCashRes;
  withdrawalData: WithdrawalRes[];
  handleWithdrawalDialogOpen: () => void;
}
const UserInfoCard = ({
  userProfileData, incomeData, withdrawalData, handleWithdrawalDialogOpen
}: UserInfoCardProps): JSX.Element => {
  const classes = useStyles();

  // 배너 광고 첫 수익 여부 정보
  const bannerAdStartData = useGetRequest('/creator/banner/start-check');
  // 클릭 광고 첫 수익 여부 정보
  const clickAdStartData = useGetRequest('/creator/clicks/start-check');

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

  return (
    <Paper className={classes.container}>

      {/* 유저 정보 섹션 */}
      <div className={classes.infoSection}>
        <Avatar
          variant="circle"
          className={classes.avatar}
          src={userProfileData.creatorLogo}
        />
        <div>
          <div>
            <Typography variant="h5" className={classes.bold}>
              {userProfileData.creatorName}
              &nbsp;
              <Typography component="span" variant="body2">아프리카,</Typography>
              <Typography component="span" variant="body2">트위치</Typography>
            </Typography>
            <Typography variant="caption">
              {userProfileData.creatorMail}
            </Typography>
          </div>
          {/* 상태 칩 섹션 */}
          <Grow in>
            <Chip
              className={classes.chip}
              size="small"
              color="primary"
              label={userProfileData.creatorContractionAgreement === 1
                ? '이용 동의완료'
                : '이용 미동의'}
            />
          </Grow>
          <Grow in>
            <Chip
              className={classnames(classes.chip, classes.success)}
              size="small"
              label={getSettlementString(userProfileData.settlementState)}
            />
          </Grow>
          {/* 한번이라도 배너 송출 로그가 찍혀있는 경우 설정 완료로 처리 */}
          {!bannerAdStartData.loading && bannerAdStartData.data && (
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
          {!clickAdStartData.loading && clickAdStartData.data && (
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
        <Typography gutterBottom variant="body1">출금가능한 수익금</Typography>
        <Typography gutterBottom variant="h4" className={classes.bold}>
          <Typography component="span" variant="body2" color="textSecondary">
            {`누적 수익 ${incomeData.creatorTotalIncome.toLocaleString()}원`}
          </Typography>
          &nbsp;
          {`${incomeData.creatorReceivable.toLocaleString()} 원`}
        </Typography>
        <Typography color="textSecondary" variant="caption">{`최근 수익 반영: ${moment(incomeData.date).fromNow()}`}</Typography>

        {(incomeData && incomeData.creatorAccountNumber) && (
        <div className={classes.right}>
          <Button
            color="primary"
            size="small"
            onClick={(): void => { handleWithdrawalDialogOpen(); }}
          >
            출금신청
          </Button>
        </div>
        )}
      </div>

      <Divider />

      <div className={classes.withdrawalSection}>
        {withdrawalData.length === 0 && (
        <div className={classes.flex} style={{ marginTop: 32 }}>
          <Typography variant="body2" className={classes.ellipsis}>아직 출금 신청 내역이 없어요..</Typography>
        </div>
        )}
        {withdrawalData && withdrawalData.slice(0, 2).map((withdrawalRequest) => (
          <div className={classes.withdrawalItem} key={shortid.generate()}>
            <Typography className={classes.ellipsis}>
              {`${withdrawalRequest.creatorWithdrawalAmount.toLocaleString()}원 출금신청 `}
              <Typography component="span" variant="caption" color="textSecondary">
                {moment(withdrawalRequest.date).format('YYYY년 MM월 DD일')}
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
        {!(withdrawalData.length === 0) && (
        <div className={classes.right}>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.moreButton}
            onClick={(): void => {
              history.push('/mypage/creator/user');
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
