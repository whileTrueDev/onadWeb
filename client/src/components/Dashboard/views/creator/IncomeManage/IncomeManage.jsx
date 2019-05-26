
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';
// @material-ui/icons
import AccessTime from '@material-ui/icons/AccessTime';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
// custum cores
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardIcon from '../../../components/Card/CardIcon';
import CardAvatar from '../../../components/Card/CardAvatar';
// data
import setChartjsData from '../../../variables/charts';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

DashboardStyle.select = {
  marginTop: 5,
  // float: 'right',
};

// data Fetch hooks
function useFetchData(url, dateRange) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url, {
        params: { dateRange },
      });
      if (res.data.length !== 0) { setPayload(res.data); }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [dateRange, url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

function useInputWidth() {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return { inputLabel, labelWidth };
}

function useSelectValue() {
  const [value, setValue] = React.useState(7);

  function handleChange(event) {
    setValue(event.target.value);
  }

  console.log(value);

  return { value, handleChange };
}

function Income(props) {
  const { classes, session } = props;
  // 날짜 범위 데이터
  const { value, handleChange } = useSelectValue();
  // data 요청
  const { payload, loading, error } = useFetchData('/dashboard/creator/chartdata', value);
  // 날짜 범위 칸의 크기를 동적으로 하기위한 훅
  const { inputLabel, labelWidth } = useInputWidth();


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="success">
              <FormControl variant="outlined" className={classes.select}>
                <InputLabel ref={inputLabel} htmlFor="selectDateRange">
                  범위
                </InputLabel>
                <Select
                  onChange={handleChange}
                  input={(
                    <OutlinedInput
                      labelWidth={labelWidth}
                      name="dateRange"
                      id="selectDateRange"
                      value={value}
                    />
                  )}
                >
                  <MenuItem value={7}>최근 7 일</MenuItem>
                  <MenuItem value={14}>최근 14 일</MenuItem>
                  <MenuItem value={30}>최근 30 일</MenuItem>
                </Select>
              </FormControl>
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
              <h4 className={classes.cardTitle} style={{ textAlign: 'left' }}>나의 총 수익금</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {`updated: ${Date()}`}
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <AttachMoney />
              </CardIcon>
              <p className={classes.cardCategory}>지금껏 총 수익금</p>
              <h3 className={classes.cardTitle}>
                {/* {`${data.creatorTotalIncome} `} */}
                수익금
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {/* {`Updated : ${data.date}`} */}
                업데이트 일자
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <AttachMoney />
              </CardIcon>
              <p className={classes.cardCategory}>지금껏 총 수익금</p>
              <h3 className={classes.cardTitle}>
                {/* {`${data.creatorTotalIncome} `} */}
                수익금
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {/* {`Updated : ${data.date}`} */}
                업데이트 일자
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Income.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);
