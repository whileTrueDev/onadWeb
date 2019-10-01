import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import GridItem from '../../../components/Grid/GridItem';
import IncomeGraph from './IncomeGraph';

// 기본 배너 정보 스테이트 값

const Dashboard = (props) => {
  const { classes } = props;

  return (
    <div>
      {/* 첫번째 라인 */}
      <GridContainer>
        {/* 총 수익금 */}
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <Card>
            <CardHeader color="blueGray" stats>
              <h4 className={classes.cardTitleWhite}>지금까지의 총 수익금</h4>
            </CardHeader>
            <CardBody>
              <IncomeGraph />
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
