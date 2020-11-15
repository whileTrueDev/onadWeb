import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Divider, Paper, Avatar, Chip
} from '@material-ui/core';
import Button from '../../../../atoms/CustomButtons/Button';
import { useGetRequest } from '../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  chip: {
    marginRight: theme.spacing(1) / 2,
    color: theme.palette.common.white
  },
  success: { backgroundColor: theme.palette.success.main, },
  error: { backgroundColor: theme.palette.error.main },
  black: { backgroundColor: theme.palette.common.black },
  info: { backgroundColor: theme.palette.info.main }
}));

export interface IncomeCashRes {
  creatorTotalIncome: number;
  creatorReceivable: number;
  creatorAccountNumber: string;
  date: string;
  creatorContractionAgreement: number;
  realName: string;
  settlementState: number;
}
interface IncomeCardProps {
  incomeData: IncomeCashRes;
  handleWithdrawalDialogOpen: () => void;
}
const IncomeCard = ({
  incomeData, handleWithdrawalDialogOpen
}: IncomeCardProps): JSX.Element => {
  const classes = useStyles();

  const profileData = useGetRequest('/creator');
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="circle"
          className={classes.avatar}
          src={profileData.data ? profileData.data.creatorLogo : ''}
        />
        <div>
          <div style={{ display: 'block', }}>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              {profileData.data ? profileData.data.creatorName : ''}
              &nbsp;
              <Typography component="span" variant="body2">아프리카,</Typography>
              <Typography component="span" variant="body2">트위치</Typography>
            </Typography>
            <Typography variant="caption">
              {profileData.data ? profileData.data.creatorMail : ''}
            </Typography>
          </div>
          {/* 상태 칩 섹션 */}
          <Chip
            style={{ marginRight: 4 }}
            size="small"
            color="primary"
            label={profileData.data && profileData.data.creatorContractionAgreement === 1
              ? '이용약관 동의완료'
              : '이용약관 미동의'}
          />
          <Chip
            className={classnames(classes.chip, classes.success)}
            size="small"
            label={profileData.data && getSettlementString(profileData.data.settlementState)}
          />
          <Chip
            className={classnames(classes.chip, classes.info)}
            size="small"
            label="배너 오버레이 설정완료"
          />
        </div>
      </div>

      {/* 수익금 섹션 */}
      <div style={{
        textAlign: 'right', margin: 8
      }}
      >
        <Typography gutterBottom variant="body1">출금가능한 수익금</Typography>
        <Typography gutterBottom variant="h4" style={{ fontWeight: 'bold', }}>
          <Typography component="span" variant="body2" color="textSecondary">
            {`누적 수익 ${incomeData.creatorTotalIncome.toLocaleString()}원`}
          </Typography>
          &nbsp;
          {`${incomeData.creatorReceivable.toLocaleString()} 원`}
        </Typography>
        <Typography color="textSecondary" variant="caption">{`최근 수익 반영: ${moment(incomeData.date).fromNow()}`}</Typography>

        {(incomeData && incomeData.creatorAccountNumber) && (
        <div style={{ textAlign: 'right' }}>
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

      <div style={{ margin: 8, marginTop: 16, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0px' }}>
          <Typography>123,456원 출금 신청 완료, 정산 대기중...</Typography>
          <Chip size="small" className={classnames(classes.chip, classes.success)} style={{ marginLeft: 8 }} label="00월 정산 예정" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0px' }}>
          <Typography>123,456원 출금 신청 진행중...</Typography>
          <Chip size="small" className={classnames(classes.chip, classes.success)} style={{ marginLeft: 8 }} label="00월 정산 예정" />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary">
            자세히 보기
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default IncomeCard;
