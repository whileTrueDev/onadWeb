import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
// @material-ui/icons
import Money from '@material-ui/icons/Money';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ListAlt from '@material-ui/icons/ListAlt';
import BarChart from '@material-ui/icons/BarChart';

// material core
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Tooltip from '@material-ui/core/Tooltip';

// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
import Button from '../../../components/CustomButtons/Button';
import CustomTabs from '../../../components/CustomTabs/CustomTabs';
import Table from './RecommendTable';
import Switch from './SwitchButton';
import AdvertiseStartModal from './AdvertiseStartModal';
import ValueChart from './ValueChart';
// Typography
import SuccessTypography from '../../../components/Typography/Success';
import DangerTypography from '../../../components/Typography/Danger';
import Muted from '../../../components/Typography/Muted';
import Info from '../../../components/Typography/Info';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
  },
  titleBar: {
    opacity: 0.95,
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    fontWeight: 'bold',
  },
}));

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
      if (res.data.length !== 0) {
        setPayload(res.data);
      } else {
        console.log(res);
        setError('데이터가 없습니다.');
        // throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('오류입니다.');
    } finally {
      setLoading(false);
    }
  }, [url, dateRange]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

function useAdStartModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState({});

  function handleModalOpen(name) {
    setSelectedBanner(name);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  return {
    modalOpen, handleModalOpen, handleModalClose, selectedBanner,
  };
}

const Dashboard = (props) => {
  const secondClasses = useStyles();
  const { classes, history } = props;

  const cashData = useFetchData('/dashboard/marketer/cash');
  const bannerData = useFetchData('/dashboard/marketer/banner');
  const tableData = useFetchData('/dashboard/marketer/creatorList');
  const {
    modalOpen, handleModalOpen,
    handleModalClose, selectedBanner,
  } = useAdStartModal();

  return (
    <div>
      {/* 첫번째 라인 */}
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          {/* 광고캐시 잔액 */}
          <GridItem xs={12} sm={6} md={12}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <AttachMoney />
                </CardIcon>
                <p className={classes.cardCategory}>광고 캐시 잔액</p>
                {cashData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
                {!cashData.loading && cashData.error
                  && (
                    <div>
                      <h4 className={classes.cardTitle}>
                        {'광고 캐시가 없어요!'}
                      </h4>
                      <Button
                        style={{ display: 'flex' }}
                        color="info"
                        to="/dashboard/cash"
                        component={Link}
                      >
                      충전하러 가기
                      </Button>
                    </div>
                  )}
                {!cashData.loading && cashData.payload
                  && (
                  <h3 className={classes.cardTitle}>
                    {`${cashData.payload.marketerDebit} `}
                    <small>원</small>
                  </h3>
                  )}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Info><Money /></Info>
                  <Link to="/dashboard/cash">
                    <span className={classes.infoText}>충전하러 가기</span>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          {/* 현재 나의 광고 상태 */}
          <GridItem xs={12} sm={6} md={12}>
            <Card>
              <CardHeader color="success" stats>
                <p className={classes.cardTitleWhite}>현재 나의 상태</p>
              </CardHeader>
              <CardBody>
                {!bannerData.loading && bannerData.error ? (
                // 승인된 배너가 없는 경우
                  <GridItem>
                    <DangerTypography>
                      <Warning />
                      {'승인된 배너가 없어요!'}
                    </DangerTypography>
                    <Button
                      style={{ display: 'flex' }}
                      color="info"
                      to="/dashboard/banner"
                      component={Link}
                    >
                  배너 관리하러 가기
                    </Button>
                  </GridItem>
                ) : (
                  <Switch history={history} />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridItem>

        {/* 승인된 배너 */}
        <GridItem xs={12} sm={6} md={8}>
          <Card>
            <CardHeader color="info" stats>
              <h4 className={classes.cardTitleWhite}>승인된 배너</h4>
              <p className={classes.cardCategoryWhite}>업로드한 배너 중 승인된 배너의 목록입니다.</p>
            </CardHeader>
            <CardBody className={secondClasses.root}>
              {bannerData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!bannerData.loading && bannerData.error && (
                // 승인된 배너가 없는 경우
                <GridItem>
                  <DangerTypography>
                    <Warning />
                    {'승인된 배너가 없어요!'}
                  </DangerTypography>
                  <Button
                    style={{ display: 'flex' }}
                    color="info"
                    to="/dashboard/banner"
                    component={Link}
                  >
                  배너 관리하러 가기
                  </Button>
                </GridItem>
              )}
              {!bannerData.loading && bannerData.payload && (
              // 승인된 배너가 있는 경우
              <Tooltip title="배너를 선택하여 광고를 진행하세요!">
                <GridList
                  cellHeight={250}
                  className={secondClasses.gridList}
                  cols={bannerData.payload.length === 1 ? 1 : 2}
                >
                  { bannerData.payload.map(image => (
                    <GridListTile
                      key={image.bannerId}
                      style={{ cursor: 'pointer' }}
                      onClick={() => { handleModalOpen(image); }}
                    >
                      <img src={image.bannerSrc} alt={image.bannerId} />
                      <GridListTileBar
                        classes={{
                          root: secondClasses.titleBar,
                          actionIcon: secondClasses.icon,
                        }}
                        actionIcon={image.confirmState === 1 ? (
                          <div>
                            <Info>
                              {'승인'}
                              <Check />
                            </Info>
                          </div>
                        ) : (
                          <div>
                            <SuccessTypography>
                              {'광고 중'}
                              <PlayArrow />
                            </SuccessTypography>
                          </div>
                        )}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Tooltip>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={12}>
          <CustomTabs
            headerColor="success"
            tabs={[
              {
                tabName: '광고될 크리에이터 목록',
                tabIcon: ListAlt,
                tabContent: (
                  tableData.loading && !tableData.payload ? (
                    <div style={{ textAlign: 'center' }}><CircularProgress /></div>
                  ) : (
                    <div>
                      <Table
                        tableHeaderColor="danger"
                        tableHead={['크리에이터 명', '방송플랫폼', '방송 분류', '평균 시청자 수 (방송당)', '시간당 비용']}
                        tableData={tableData.payload}
                      />
                      <Muted>
                    * 베타테스트이므로, 제한된 수의 크리에이터만 존재해요! 향후 더욱 정교한 추천시스템, 그리고 더 많은 기능을 선보일게요!
                      </Muted>
                    </div>
                  )),
              },
              {
                tabName: '성과 차트',
                tabIcon: BarChart,
                tabContent: <ValueChart />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>

      { !cashData.loading && cashData.payload && tableData.payload && (
        <AdvertiseStartModal
          open={modalOpen}
          onClose={handleModalClose}
          marketerDebit={cashData.payload.marketerDebit}
          selectedBanner={selectedBanner}
          tableData={tableData.payload}
          history={history}
        />
      )}
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);

/** Tabs [0] */
// // 내 광고 목록.
// {
//   tabName: '내 광고',
//   tabIcon: Videocam,
//   tabContent: (
//     bannerData.loading && !bannerData.payload ? (
//       <div style={{ textAlign: 'center' }}><CircularProgress /></div>
//     ) : (
//       <div>
//         {/* <Table
//           tableHeaderColor="danger"
//           tableHead={['광고중 배너', '현재 상태', '노출 수', '비용', '일 예산']}
//           tableData={[Object.values(bannerData.payload[0])]}
//         /> */}
//       </div>
//     )),
// },
