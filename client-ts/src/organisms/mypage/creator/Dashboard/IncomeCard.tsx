import React, { useState } from 'react';
import classnames from 'classnames';
import { Theme, makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../../../atoms/CustomCard';
import Button from '../../../../atoms/CustomButtons/Button';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import WithdrawalDialog from './WithdrawalDialog';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  stats: {
    color: theme.palette.text.hint,
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: 500,
  }
}));

interface IncomeCashRes {
  creatorTotalIncome: number;
  creatorReceivable: number;
  creatorAccountNumber: string;
  date: string;
  creatorContractionAgreement: number;
  realName: string;
}

const IncomeCard = (): JSX.Element => {
  const classes = useStyles();
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');

  // 출금 신청 다이얼로그
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    if (incomeCashGet.data && !incomeCashGet.data.creatorAccountNumber) {
      alert('등록된 계좌가 존재하지 않으므로 내 계정으로 이동합니다.');
      history.push('/mypage/creator/user');
    }
    setOpen(true);
  };
  const handleClose = (): void => { setOpen(false); };

  return (
    <CustomCard
      iconComponent={<AttachMoney />}
      buttonComponent={(!incomeCashGet.loading
        && incomeCashGet.data
        && incomeCashGet.data.creatorAccountNumber) && (
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
          {incomeCashGet.loading && (<CircularProgress small />)}
          {!incomeCashGet.loading && !incomeCashGet.error && incomeCashGet.data && (
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5">
              {`${incomeCashGet.data.creatorReceivable} 원`}
            </Typography>
          </div>
          )}
        </Grid>
        <Grid item>
          <Divider variant="middle" component="hr" />
        </Grid>
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1" className={classes.head}>총 수익금</Typography>
          </div>
          {incomeCashGet.loading && (<CircularProgress small />)}
          {!incomeCashGet.loading && !incomeCashGet.error && incomeCashGet.data && (
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5">
              {`${incomeCashGet.data.creatorTotalIncome} 원`}
            </Typography>
          </div>
          )}
        </Grid>
        <Grid item>
          <div
            className={classnames(classes.stats, classes.flex)}
          >
            {!incomeCashGet.loading && !incomeCashGet.error
              && incomeCashGet.data && incomeCashGet.data.date
              && (
              <div>
                <DateRange />
                <span>{`업데이트 : ${incomeCashGet.data.date}`}</span>
              </div>
              )}
          </div>
        </Grid>
      </Grid>
      {!incomeCashGet.loading && !incomeCashGet.error && incomeCashGet.data
      && incomeCashGet.data.creatorContractionAgreement
      && incomeCashGet.data.creatorAccountNumber && (
        <WithdrawalDialog
          open={open}
          handleClose={handleClose}
          realName={incomeCashGet.data.realName}
          accountNumber={incomeCashGet.data.creatorAccountNumber}
          receivable={incomeCashGet.data.creatorReceivable}
        />
      )}
    </CustomCard>
  );
};

export default IncomeCard;
