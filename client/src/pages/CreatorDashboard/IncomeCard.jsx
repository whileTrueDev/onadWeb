import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../components/NewCreates/CustomCard';
import Button from '../../components/NewCreates/CustomButtons/Button';
import CircularProgress from '../../components/NewCreates/Progress/CircularProgress';
import useFetchData from '../../utils/lib/hooks/useFetchData';

const useStyles = makeStyles(_theme => ({
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
    color: '#455a64',
  }
}));

const WithdrawalButton = (props) => {
  const { handleClick } = props;
  return (<Button color="info" onClick={() => { }}>출금신청</Button>);
};

const IncomeCard = () => {
  const classes = useStyles();
  const cashData = useFetchData('/api/dashboard/creator/income');

  // 출금신청 버튼 클릭시
  const handleIncomeClick = () => '하이';

  return (
    <CustomCard iconComponent={<AttachMoney />} buttonComponent={<WithdrawalButton />}>
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
    </CustomCard>
  );
};

export default IncomeCard;
