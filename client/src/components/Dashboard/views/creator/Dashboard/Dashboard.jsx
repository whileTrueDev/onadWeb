import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// for request
// for Link tag component
import { Link } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
// @material-ui/icons
import CheckIcon from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Money from '@material-ui/icons/Money';
import axios from '../../../../../utils/axios';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Table from '../../../components/Table/Table';
import Danger from '../../../components/Typography/Danger';
import Info from '../../../components/Typography/Info';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
import ShowSrcBtn from './ShowSrcBtn';
// 기본 배너 정보 스테이트 값
import {
  defaultIncomeData,
  defaultBannerData,
  defaultCurruntBanner,
} from '../../../variables/creatorDashboardDefault';
import HOST from '../../../../../config';

const Dashboard = (props) => {
  const { classes } = props;

  // 현재 송출중 배너 데이터 관련 로직
  const [currentBannerData, setCurrentBannerData] = React.useState([['', '']]);

  useEffect(() => {
    axios.get(`${HOST}/api/dashboard/creator/currentBanner`)
      .then((res) => {
        if (res.data.length > 0) {
          setCurrentBannerData(res.data);
        } else {
          setCurrentBannerData(defaultCurruntBanner);
        }
      })
      .catch(() => {
        setCurrentBannerData(defaultCurruntBanner);
      });
  }, []);

  // 크리에이터 이름, 수익금 데이터 관련 로직
  const [data, setData] = useState(defaultIncomeData);

  useEffect(() => {
    // income 데이터 axios 요청
    axios.get(`${HOST}/api/dashboard/creator/income`).then((res) => {
      if (res.data) {
        if (!res.data.length) {
          setData(res.data);
        } else { setData(defaultIncomeData); }
      }
    }).catch(() => {
      setData(defaultIncomeData);
    });
  }, []);

  // 내 모든 광고 리스트 데이터
  const [bannerData, setBannerData] = useState(defaultBannerData);
  useEffect(() => {
    // Banner 데이터 axios 요청
    axios.get(`${HOST}/api/dashboard/creator/matchedBanner`)
      .then((res) => {
        if (res.data) {
          if (res.data) {
            setBannerData(res.data);
          } else { setBannerData(defaultBannerData); }
        }
      }).catch(() => {
        setBannerData(defaultBannerData);
      });
  }, []); // set 2nd argument to the empty array for request just once


  const [session, setSession] = useState({});
  useEffect(() => {
    // Banner 데이터 axios 요청
    axios.get(`${HOST}/api/dashboard/checkUserType`)
      .then((res) => {
        if (res.data) {
          setSession(res.data);
        }
      });
  }, []);


  // 배너 테이블 state, 테이블 페이지 state 선언
  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, bannerData.length - page * rowsPerPage,
  );
  // page handler
  function handleChangeTablePage(event, newPage) {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }


  return (
    <div>
      {/* 첫번째 라인 */}
      <GridContainer>
        {/* 총 수익금 */}
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="blueGray" stats icon>
              <CardIcon color="blueGray">
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
            <CardHeader color="blueGray" stats icon>
              <CardIcon color="blueGray">
                <CheckIcon />
              </CardIcon>
              <p className={classes.cardCategory}>출금 가능한 수익금</p>
              <h3 className={classes.cardTitle}>
                {`${data.creatorReceivable} `}
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <Tooltip title="수익관리 탭으로 이동해요!">
                <div className={classes.stats} style={{ alignItems: 'center' }}>
                  <Info><Money /></Info>
                  <Link to="/dashboard/creator/income">
                    <span className={classes.infoText}>출금 신청하러가기</span>
                  </Link>
                </div>
              </Tooltip>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        {/* 현재송출 중인 배너 */}
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>
              현재 송출 중인 배너
              </h4>
              <p className={classes.cardCategoryWhite}>현재 송출 중인 배너 목록을 보여줍니다</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="danger"
                tableHead={['배너', '광고주']}
                tableData={currentBannerData}
              />
            </CardBody>
          </Card>
        </GridItem>

        {/* URL 공개 라인 */}
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>
              배너 오버레이 URL
              </h4>
              <p className={classes.cardCategoryWhite}>광고 송출용 URL 페이지를 보여줍니다.</p>
            </CardHeader>
            <CardBody>
              <ShowSrcBtn
                creatorId={session.creatorId}
                style={{ textAlign: 'center' }}
              />
            </CardBody>
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
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>내 모든 광고 내역</h4>
              <p className={classes.cardCategoryWhite}>
                  지금껏 내가 광고한 모든 배너를 보여줍니다.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="blueGray"
                tableHead={bannerData.columns}
                tableData={bannerData.data}
                pagination
                handleChangeTablePage={handleChangeTablePage}
                handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
                emptyRows={emptyRows}
                rowsPerPage={rowsPerPage}
                page={page}
              />
            </CardBody>
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
