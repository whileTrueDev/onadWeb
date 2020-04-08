import React, { useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../../../atoms/CustomCard';
import Button from '../../../../atoms/CustomButtons/Button';
import WithdrawalDialog from './WithdrawalDialog';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: 500,
  }
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

  // 출금 신청 다이얼로그
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    if (incomeData && !incomeData.creatorAccountNumber) {
      alert('등록된 계좌가 존재하지 않으므로 내 계정으로 이동합니다.');
      history.push('/mypage/creator/user');
    }
    setOpen(true);
  };
  const handleClose = (): void => { setOpen(false); };

  return (
    <CustomCard
      iconComponent={<AttachMoney />}
      buttonComponent={(incomeData.creatorAccountNumber) && (
        <Button
          color="primary"
          onClick={(): void => { handleOpen(); }}
        >
          출금신청
        </Button>
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1" className={classes.head}>출금가능한 수익금</Typography>
          </div>
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5">
              {`${incomeData.creatorReceivable} 원`}
            </Typography>
          </div>
        </Grid>
        <Grid item>
          <Divider variant="middle" component="hr" />
        </Grid>
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1" className={classes.head}>총 수익금</Typography>
          </div>
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5">
              {`${incomeData.creatorTotalIncome} 원`}
            </Typography>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.flex}>
            {incomeData.date && (
              <Typography variant="caption" color="textSecondary">
                <DateRange />
                {`업데이트 : ${incomeData.date}`}
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
      {incomeData && incomeData.creatorContractionAgreement
        && incomeData.creatorAccountNumber && (
          <WithdrawalDialog
            open={open}
            handleClose={handleClose}
            realName={incomeData.realName}
            accountNumber={incomeData.creatorAccountNumber}
            receivable={incomeData.creatorReceivable}
          />
        )}
    </CustomCard>
  );
};

export default IncomeCard;
