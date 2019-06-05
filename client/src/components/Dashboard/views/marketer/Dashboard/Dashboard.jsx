import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
// @material-ui/icons
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Check from '@material-ui/icons/Check';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
import Table from '../../../components/Table/Table';
import SuccessTypography from '../../../components/Typography/Success';

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
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [url, dateRange]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

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

const Dashboard = (props) => {
  const imageClasses = useStyles();
  const { classes, session } = props;

  const cashData = useFetchData('/dashboard/marketer/cash');
  const bannerData = useFetchData('/dashboard/marketer/banner');

  return (
    <div>
      {/* 인사 */}
      <span>
        <h4>
        안녕하세요.
          {` ${session.marketerName} 님 `}
        행복한 하루 되세요
        </h4>
      </span>


      {/* 첫번째 라인 */}
      <GridContainer>
        {/* 광고캐시 잔액 */}
        <GridItem xs={12} sm={6} md={4}>
          <GridItem xs={12} sm={6} md={12}>
            <Card>
              {cashData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!cashData.loading && cashData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!cashData.loading && cashData.payload
                  && (
                    <CardHeader color="info" stats icon>
                      <CardIcon color="info">
                        <AttachMoney />
                      </CardIcon>
                      <p className={classes.cardCategory}>광고 캐시 잔액</p>
                      <h3 className={classes.cardTitle}>
                        {`${cashData.payload.marketerDebit} `}
                        <small>원</small>
                      </h3>
                    </CardHeader>
                  )}
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  {!cashData.loading && cashData.payload
                  && <span>{`Updated : ${cashData.payload.date}`}</span>
                  }
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={12}>
            <Card>
              {cashData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!cashData.loading && cashData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!cashData.loading && cashData.payload
              && (
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <AttachMoney />
                  </CardIcon>
                  <p className={classes.cardCategory}>광고 캐시 잔액</p>
                  <h3 className={classes.cardTitle}>
                    {`${cashData.payload.marketerDebit} `}
                    <small>원</small>
                  </h3>
                </CardHeader>
              )}
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  {!cashData.loading && cashData.payload
                  && <span>{`Updated : ${cashData.payload.date}`}</span>
                  }
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridItem>

        {/* 승인된 배너 */}
        <GridItem xs={12} sm={6} md={8}>
          <Card>
            <CardHeader color="primary" stats>
              <h4 className={classes.cardTitleWhite}>승인된 배너</h4>
              <p className={classes.cardCategoryWhite}>업로드한 배너 중 승인된 배너의 목록입니다.</p>
            </CardHeader>
            <CardBody className={imageClasses.root}>
              {bannerData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!bannerData.loading && bannerData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!bannerData.loading && bannerData.payload && (
                <GridList
                  className={imageClasses.gridList}
                  cols={2.1}
                >
                  {bannerData.payload.map(image => (
                    <GridListTile key={image.bannerId}>
                      <img src={image.bannerSrc} alt={image.bannerId} />
                      <GridListTileBar
                        classes={{
                          root: imageClasses.titleBar,
                          actionIcon: imageClasses.icon,
                        }}
                        actionIcon={(
                          <SuccessTypography>
                            {'승인 '}
                            <Check />
                          </SuccessTypography>
                      )}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>추천 크리에이터 내역</h4>
              <p className={classes.cardCategoryWhite}>
                선택한 광고예산에 따른 추천크리에이터 내역입니다.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={['Name', 'Country', 'City', 'Salary']}
                tableData={[
                  ['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738'],
                  ['Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
                  ['Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
                  ['Philip Chaney', 'Korea, South', 'Overland Park', '$38,735'],
                  ['Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
                  ['Mason Porter', 'Chile', 'Gloucester', '$78,615'],
                ]}
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
  session: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
