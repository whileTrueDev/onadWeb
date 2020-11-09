import React, { useState } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider, Paper, Avatar, Chip
} from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../../../atoms/CustomCard';
import Button from '../../../../atoms/CustomButtons/Button';
import WithdrawalDialog from './WithdrawalDialog';
import history from '../../../../history';
import { useGetRequest } from '../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
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
  successChip: {
    marginRight: theme.spacing(1) / 2,
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white
  },
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
}
const IncomeCard = ({ incomeData }: IncomeCardProps): JSX.Element => {
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
  console.log(profileData);
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
            label={profileData.data && profileData.data.creatorContractionAgreement === 1 ? '계약완료' : '미계약'}
          />
          <Chip
            className={classes.successChip}
            size="small"
            label={profileData.data && getSettlementString(profileData.data.settlementState)}
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
      </div>

    </Paper>
  );
};

export default IncomeCard;
