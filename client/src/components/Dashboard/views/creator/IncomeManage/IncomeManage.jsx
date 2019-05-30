
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';

// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// } from 'recharts';

// @material-ui/icons
import AccessTime from '@material-ui/icons/AccessTime';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountDialog from './AccountDialog';
// core components
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardAvatar from '../../../components/Card/CardAvatar';
// data
import setChartjsData from '../../../variables/charts';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

// data Fetch hooks
function useFetchData(url) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountDialogOpen, setDialogOpen] = useState(false);

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url);
      if (res.data.length !== 0) {
        setDialogOpen(res.data.creatorAccountNumber === null);
        setPayload(res.data);
      } else {
        setDialogOpen(res.data.creatorAccountNumber === null);
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return {
    payload, loading, error, accountDialogOpen, setDialogOpen,
  };
}


function Income(props) {
  const { classes, session, history } = props;
  const {
    payload, loading, error, accountDialogOpen, setDialogOpen,
  } = useFetchData('/dashboard/creator/chartdata');
  console.log('수행');
  return (
    <GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="success">
              {loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!loading && error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!loading && payload
          && (
          <Line
            data={setChartjsData(payload.labels, payload.totalIncomeData)}
            options={{ tooltips: { mode: 'index', intersect: false } }}
          />
          )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle} style={{ textAlign: 'left' }}>나의 수익금</h4>

            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
            updated:
                {' '}
                {Date()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#avatar" onClick={e => e.preventDefault()}>
                <img src={session.creatorLogo} alt="creator" />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h5 className={classes.cardCategory} style={{ marginBottom: 30 }}>크리에이터</h5>
              <h4 className={classes.cardTitle}>{session.creatorDisplayName}</h4>
              <p className={classes.description}>
                {`Don't be scared of the truth because we need to restart the
              human foundation in truth And I love you like Kanye loves Kanye
              I love Rick Owens’ bed design but the back is...`}
              </p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <AccountDialog open={accountDialogOpen} history={history} setDialogOpen={setDialogOpen} />
    </GridContainer>
  );
}

Income.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);
