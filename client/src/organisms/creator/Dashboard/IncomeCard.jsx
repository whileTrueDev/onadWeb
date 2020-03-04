import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../../atoms/CustomCard';
import Button from '../../../atoms/CustomButtons/Button';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import WithdrawalDialog from './WithdrawDialog';
import history from '../../../history';


const useStyles = makeStyles((theme) => ({
  stats: {
    color: '#999',
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
    fontWeight: '500',
  }
}));

const WithdrawalButton = (props) => {
  const { handleOpen } = props;
  return (<Button color="primary" onClick={() => { handleOpen(); }}>출금신청</Button>);
};

const IncomeCard = () => {
  const classes = useStyles();
  const cashData = useFetchData('/api/dashboard/creator/income');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!cashData.payload.creatorAccountNumber) {
      alert('등록된 계좌가 존재하지 않으므로 내 계정으로 이동합니다.');
      history.push('/dashboard/creator/user');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomCard
      iconComponent={<AttachMoney />}
      buttonComponent={<WithdrawalButton handleOpen={handleOpen} />}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1" className={classes.head}>출금가능한 수익금</Typography>
          </div>
          {cashData.loading && (<CircularProgress small />)}
          {!cashData.loading && !cashData.error && (
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5" style={{ fontSize: ' 1.7rem' }}>
              {`${cashData.payload.creatorReceivable} 원`}
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
          {cashData.loading && (<CircularProgress small />)}
          {!cashData.loading && !cashData.error && (
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5">
              {`${cashData.payload.creatorTotalIncome} 원`}
            </Typography>
          </div>
          )}
        </Grid>
        <Grid item>
          <div
            className={classnames(classes.stats, classes.flex)}
          >
            {!cashData.loading && !cashData.error && cashData.payload.date
              && (
              <div>
                <DateRange />
                <span>{`업데이트 : ${cashData.payload.date}`}</span>
              </div>
              )}
          </div>
        </Grid>
      </Grid>
      {!cashData.loading && !cashData.error
      && cashData.payload.creatorContractionAgreement && cashData.payload.creatorAccountNumber && (
        <WithdrawalDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          realName={cashData.payload.realName}
          accountNumber={cashData.payload.creatorAccountNumber}
          receivable={cashData.payload.creatorReceivable}
        />
      )}
    </CustomCard>
  );
};

export default IncomeCard;
