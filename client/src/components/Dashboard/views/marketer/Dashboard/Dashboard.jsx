import React from 'react';
import PropTypes from 'prop-types';
// for Link tag component
import { Link } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons
import CheckIcon from '@material-ui/icons/Check';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Money from '@material-ui/icons/Money';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Info from '../../../components/Typography/Info';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';

const Dashboard = (props) => {
  const { classes, session } = props;

  return (
    <div>
      {/* 인사 */}
      <span>
        <h4>
        안녕하세요.
          {` ${session.creatorDisplayName} 님 `}
        행복한 하루 되세요
        </h4>
      </span>

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
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
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
                <small>원</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats} style={{ alignItems: 'center' }}>
                <Info><Money /></Info>
                <Link to="/dashboard/user">
                  <span className={classes.infoText}>출금 신청 하시겠어요?</span>
                </Link>
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
