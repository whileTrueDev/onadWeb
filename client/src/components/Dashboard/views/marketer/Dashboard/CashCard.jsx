import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DateRange from '@material-ui/icons/DateRange';
import Typography from '@material-ui/core/Typography';
// Custom components
import CircularProgress from '../../../components/Progress/CircularProgress';
import useFetchData from '../../../lib/hooks/useFetchData';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function CashCard(props) {
  const classes2 = useStyles();
  const { classes } = props;
  const cashData = useFetchData('/api/dashboard/marketer/cash');

  return (
    <div>

      <div className={classes2.flex}>
        <Typography gutterBottom variant="body1">보유 광고캐시</Typography>
      </div>
      {cashData.loading && (<CircularProgress small />)}
      {!cashData.loading && !cashData.error && (
        <div className={classes2.flex}>

          <Typography gutterBottom variant="h5">
            {`${cashData.payload.cashAmount} 원`}
          </Typography>
        </div>
      )}
      <div
        className={classes.stats}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {!cashData.loading && !cashData.error && cashData.payload.date
              && (
                <div>
                  <DateRange />
                  <span>{`업데이트 : ${cashData.payload.date}`}</span>
                </div>
              )}
      </div>

      <div className={classes2.flex} style={{ flexDirection: 'column', margin: 20 }}>
        <div>
          표 제어 및 잡다한 정보 ( 개인/기업 유형)
        </div>
        <br />
        <div>

          표 제어 및 잡다한 정보 ( 개인/기업 유형)
        </div>
        <br />
        <div>

          표 제어 및 잡다한 정보 ( 개인/기업 유형)
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
CashCard.propTypes = {
  classes: PropTypes.object.isRequired
};
