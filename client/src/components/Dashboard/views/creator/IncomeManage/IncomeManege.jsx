
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

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const data = await axios.get(url);
      if (data.length !== 0) { setPayload(data.data); }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

function Income(props) {
  const { classes, session } = props;
  const { payload, loading, error } = useFetchData('/dashboard/creator/chartdata');

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
                {`updated:${Date()}`}
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

      {/* <GridContainer>
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
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="success">
              {loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!loading && error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!loading && payload
                && (
                  <LineChart
                    height={300}
                    width={620}
                    data={[
                      { date: '05-21', totalIncome: 101223, receivable: 123 },
                      { date: '05-22', totalIncome: 112324, receivable: 1234 },
                      { date: '05-23', totalIncome: 121345, receivable: 12345 },
                      { date: '05-24', totalIncome: 123456, receivable: 123456 },
                      { date: '05-25', totalIncome: 133456, receivable: 123456 },
                      { date: '05-26', totalIncome: 143456, receivable: 123456 },
                      { date: '05-27', totalIncome: 153456, receivable: 123456 },
                    ]}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalIncome"
                      stroke="#8884d8"
                      strokeWidth={5}
                      activeDot={{ r: 8 }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receivable"
                      stroke="#82ca9d"
                      strokeWidth={5}

                    />
                  </LineChart>
                )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle} style={{ textAlign: 'left' }}>나의 수익금</h4>
              <p className={classes.cardCategory} style={{ textAlign: 'left' }}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} />
            55%
                </span>
            increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
        updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer> */}
    </GridContainer>
  );
}

Income.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);
