import React, { useState, useEffect, useCallback } from 'react';
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
import Table from '../../../components/Table/BannerListTable';
import Danger from '../../../components/Typography/Danger';
import Info from '../../../components/Typography/Info';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
import CircularProgress from '../../../components/Progress/CircularProgress';
import ShowSrcBtn from './ShowSrcBtn';
// 기본 배너 정보 스테이트 값
import {
  defaultIncomeData,
  defaultBannerData,
  defaultCurruntBanner,
} from '../../../variables/creatorDashboardDefault';
import HOST from '../../../../../config';
import BannerDescDialog from './BannerDescDialog';
import CheckDialog from './CheckDialog';

const Dashboard = (props) => {
  const { classes } = props;

  // 중 배너 데이터 관련 로직
  const [currentBannerData, setCurrentBannerData] = useState([['', '']]);
  const [currentBannerDataLoading, setCurrentBannerDataLoading] = useState(true);
  useEffect(() => {
    axios.get(`${HOST}/api/dashboard/creator/currentBanner`)
      .then((res) => {
        if (res.data.length > 0) {
          setCurrentBannerData(res.data);
          setCurrentBannerDataLoading(false);
        } else {
          setCurrentBannerData(defaultCurruntBanner);
          setCurrentBannerDataLoading(false);
        }
      })
      .catch(() => {
        setCurrentBannerData(defaultCurruntBanner);
        setCurrentBannerDataLoading(false);
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
  const [bannerData, setBannerData] = useState([]);
  const [bannerDataLoading, setBannerDataLoading] = useState(true);

  const callBanner = useCallback(() => {
    axios.get(`${HOST}/api/dashboard/creator/matchedBanner`)
      .then((res) => {
        if (res.data) {
          setBannerData(res.data);
        }
        setBannerDataLoading(false);
      }).catch(() => {
        setBannerDataLoading(false);
        setBannerData(defaultBannerData);
      });
  }, []);
  // callback으로 만들자.
  useEffect(() => {
    // Banner 데이터 axios 요청
    callBanner();
  }, [callBanner]); // set 2nd argument to the empty array for request just once

  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(3); // 테이블 당 행

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

  /* index를 받아서 전달되기는하는데, pagnation일 때는 확인을 하지 못함. */
  const [descDialgOpen, setDescDialogOpen] = React.useState(false);
  const [checkDialgOpen, setCheckDialogOpen] = React.useState(false);
  const [descData, setDescData] = useState({});
  const handleDescDialog = index => (event) => {
    event.preventDefault();
    const contractionId = bannerData.contractionIds[index];
    axios.post(`${HOST}/api/dashboard/creator/banner/desc`, { contractionId })
      .then((res) => {
        setDescData(res.data);
        setDescDialogOpen(true);
      }).catch(() => {
        alert('오류입니다. 본사에 문의하세요.');
      });
  };

  const handleCloseDialog = () => {
    setDescDialogOpen(false);
  };

  const [myIndex, setIndex] = React.useState(0);
  const handleDeleteChoice = index => (event) => {
    event.preventDefault();
    setIndex(index);
    setCheckDialogOpen(true);
  };

  const handleBannerDelete = (event) => {
    event.preventDefault();
    const contractionId = bannerData.contractionIds[myIndex];
    if (!contractionId.includes('onad6309_01')) {
      axios.post(`${HOST}/api/dashboard/creator/banner/delete`, { contractionId })
        .then((res) => {
          if (res.data[0]) {
            callBanner();
            alert(res.data[1]);
          } else {
            alert('오류입니다. 본사에 문의하세요.');
          }
        }).catch(() => {
          alert('오류입니다. 본사에 문의하세요.');
        });
    } else {
      alert('삭제할 수 없는 기본 배너입니다.');
    }
    setCheckDialogOpen(false);
  };

  return (
    <div>
      {/* 첫번째 라인 */}
      <GridContainer>
        {/* 총 수익금 */}
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <Card>
            <CardHeader color="blueGray" stats icon>
              <CardIcon color="blueGray">
                <AttachMoney />
              </CardIcon>
              <p className={classes.cardCategory}>지금까지의 총 수익금</p>
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
        {/* 출금 가능 수익금 */}
        <GridItem xs={12} sm={6} md={6} xl={4}>
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
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>
              현재 송출 중인 배너
              </h4>
              <p className={classes.cardCategoryWhite}>현재 송출 중인 배너 목록을 보여줍니다</p>
            </CardHeader>
            <CardBody>
              {currentBannerDataLoading ? (
                <CircularProgress />
              ) : (
                <Table
                  tableHeaderColor="danger"
                  tableHead={['광고주', '배너']}
                  tableData={currentBannerData}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>

        {/* URL 공개 라인 */}
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>
              배너 오버레이 URL
              </h4>
              <p className={classes.cardCategoryWhite}>광고 송출용 URL 페이지를 보여줍니다.</p>
            </CardHeader>
            <CardBody
              // 옆의 배너목록창과 크기를 맞추기 위해
              style={{ minHeight: '21vh' }}
            >
              <ShowSrcBtn style={{ textAlign: 'center' }} />
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
        <GridItem xs={12} sm={12} md={12} xl={8}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>내 모든 광고 내역</h4>
              <p className={classes.cardCategoryWhite}>
                  지금까지 내가 광고한 모든 배너를 보여줍니다.
              </p>
            </CardHeader>
            <CardBody>
              {bannerDataLoading ? (
                <CircularProgress />
              ) : (
                bannerData.hasOwnProperty('data') && (
                <Table
                  tableHeaderColor="danger"
                  tableHead={bannerData.columns}
                  tableData={bannerData.data}
                  pagination
                  handleChangeTablePage={handleChangeTablePage}
                  handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
                  emptyRows={emptyRows}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  buttonSet
                  handleDescDialog={handleDescDialog}
                  handleBannerDelete={handleDeleteChoice}
                />
                )
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <BannerDescDialog open={descDialgOpen} descData={descData} handleClose={handleCloseDialog} />
      <CheckDialog open={checkDialgOpen} setOpen={setCheckDialogOpen} handleBannerDelete={handleBannerDelete} callBanner={callBanner} />
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(dashboardStyle)(Dashboard);
