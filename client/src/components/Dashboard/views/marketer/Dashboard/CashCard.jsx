import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DateRange from '@material-ui/icons/DateRange';
import Typography from '@material-ui/core/Typography';

// Custom components
import CircularProgress from '../../../components/Progress/CircularProgress';
import Tabs from '../../../components/Tabs/Tabs';
import UserProfile from './sub/UserProfile';
import AdProfile from './sub/AdProfile';
import GraphConsole from './sub/GraphConsole';
// hooks
import useFetchData from '../../../lib/hooks/useFetchData';


const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.between('md', 'lg')]: {
      display: 'flex', justifyContent: 'space-around', alignItems: 'center'
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabs: {
    margin: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      margin: theme.spacing(1),
    }
  },
}));

export default function CashCard(props) {
  const classes2 = useStyles();
  const {
    classes, marketerProfileData, campaignData, bannerData
  } = props;
  const cashData = useFetchData('/api/dashboard/marketer/cash');

  return (
    <div className={classes2.root}>

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
      </div>
      <div className={classes2.tabs}>
        <div className={classes2.flex}>
          <Tabs
            labels={['유저 정보', '광고 정보', '그래프 제어']}
            tabComponents={[
              <UserProfile
                marketerProfileData={marketerProfileData}
              />,
              <AdProfile
                campaignData={campaignData}
                bannerData={bannerData}
              />,
              <GraphConsole />,
            ]}
          />
        </div>

      </div>
    </div>
  );
}
CashCard.propTypes = {
  classes: PropTypes.object.isRequired,
  campaignData: PropTypes.object,
  marketerProfileData: PropTypes.object,
  bannerData: PropTypes.object,
};
