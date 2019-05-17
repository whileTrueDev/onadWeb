import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';
// for request
import axios from 'axios';
// for Link tag component
import { Link } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons
import CheckIcon from '@material-ui/icons/Check';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Money from '@material-ui/icons/Money';
// core ../../components
import dashboardStyle from '../../assets/jss/onad/views/dashboardStyle';
import { ChartjsData } from '../../variables/charts';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import Danger from '../../components/Typography/Danger';
import Info from '../../components/Typography/Info';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import GridItem from '../../components/Grid/GridItem';

// 임시로 크리에이터 아이디 설정
const creatorId = '1234567890';

const Dashboard = (props) => {
  const { classes } = props;

  // 대시보드에 필요한 데이터 임시적으로 사용
  const [data, setData] = useState({
    code: 0,
    creatorId: '0',
    creatorName: 'NoOne',
    creatorTotalIncome: 0,
    creatorReceivable: 0,
    date: '2019-05-16 16:10:12',
  });

  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    // income 데이터 axios 요청
    axios.get('/dashboard/creator/income', {
      params: {
        creatorId,
      },
    }).then((res) => {
      setData(res.data);
    }).catch((res) => {
      console.log(res);
    });

    // Banner 데이터 axios 요청
    axios.get('/dashboard/creator/matchedBanner', {
      params: {
        creatorId,
      },
    }).then((res) => {
      setBannerData(res.data);
    }).catch((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div>
      {/* 인사 */}
      <p>
        <h4>
        안녕하세요.
          {` ${data.creatorName} 님 `}
        행복한 하루 되세요
        </h4>
      </p>

      {/* 첫번째 라인 */}
      <GridContainer>
        {/* 총 수익금 */}
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <AttachMoney />
              </CardIcon>
              <p className={classes.cardCategory}>지금껏 총 수익금</p>
              <h3 className={classes.cardTitle}>
                {`${data.creatorTotalIncome} `}
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {`Updated : ${data.date}`}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <CheckIcon />
              </CardIcon>
              <p className={classes.cardCategory}>출금 가능한 수익금</p>
              <h3 className={classes.cardTitle}>
                {`${data.creatorReceivable} `}
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats} style={{ alignItems: 'center' }}>
                <Info><Money /></Info>
                <Link to="/dashboard/user" underline>
                  <span className={classes.infoText}>출금 신청 하시겠어요?</span>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* URL 공개 라인 */}
      <GridContainer>
        <GridItem xs={12} sm={6} md={12}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <VideocamOff />
              </CardIcon>
              <p className={classes.cardCategory}>오버레이 URL</p>
              <h3 className={classes.cardTitle}>오버레이 컴포넌트자리</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <span className={classes.dangerText}>타인에게 노출되지 않도록 주의하세요!</span>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* 세번쨰 라인 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>내 모든 광고 내역</h4>
              <p className={classes.cardCategoryWhite}>
                  지금껏 내가 광고한 모든 배너를 보여줍니다.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={['ID', 'Name', 'Salary', 'Country']}
                tableData={[
                  ['1', 'Dakota Rice', '$36,738', 'Niger'],
                  ['2', 'Minerva Hooper', '$23,789', 'Curaçao'],
                  ['3', 'Sage Rodriguez', '$56,142', 'Netherlands'],
                  ['4', 'Philip Chaney', '$38,735', 'Korea, South'],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      {/* 두번째 라인 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <Line
                data={ChartjsData}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
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
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <Line
                data={ChartjsData}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>
                  Last Campaign Performance
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {' '}
campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
