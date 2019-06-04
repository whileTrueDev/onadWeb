import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// for Link tag component
import { Link } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons
import CheckIcon from '@material-ui/icons/Check';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Money from '@material-ui/icons/Money';
import CircularProgress from '@material-ui/core/CircularProgress';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Info from '../../../components/Typography/Info';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';

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

const Dashboard = (props) => {
  const { classes, session } = props;

  const cashData = useFetchData('/dashboard/marketer/cash');

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
        {/* 승인된 배너 */}
        {/* <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <CheckIcon />
              </CardIcon>
              <p className={classes.cardCategory}>승인된 최신의 배너</p>
              <ButtonBase
                key={image.title}
                className={classes.imageWrapper}
                onClick={handleModalOpen}
                style={{
                  width: image.width,
                }}
              >
                <div
                  className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${image.url})`,
                  }}
                />
                <div className={classes.imageBackdrop} />
                <div className={classes.imageButton}>
                  <Typography
                    variant="h5"
                    color="inherit"
                    className={classes.imageTitle}
                  >
                    {image.title}
                    <div className={classes.imageMarked} />
                  </Typography>
                  { matches && (
                  <Grid container>
                    <Typography
                      variant="subtitle2"
                      className={classes.imageSubTitle}
                    >
                      {image.description}
                    </Typography>
                  </Grid>
                  )}

                </div>
              </ButtonBase>

            </CardHeader>
          </Card>
        </GridItem> */}
        {/* 광고캐시 잔액 */}
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            {cashData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
            {!cashData.loading && cashData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
            {!cashData.loading && cashData.payload
                && (
                  <CardHeader color="primary" stats icon>
                    <CardIcon color="primary">
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
      </GridContainer>
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
