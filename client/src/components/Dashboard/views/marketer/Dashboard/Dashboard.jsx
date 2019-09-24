import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core ../../../components
import AttachMoney from '@material-ui/icons/AttachMoney';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import Button from '../../../components/CustomButtons/Button';
import ValueChart from './ValueChart';
import CashCard from './CashCard';
import StatusBar from './StatusBar';
import CardIcon from '../../../components/Card/CardIcon';

import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import CampaignTable from './CampaignTable';

const Dashboard = (props) => {
  const { classes } = props;
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} md={12} xl={12}>
          <StatusBar />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} xl={3}>
          <Card>
            <CardHeader color="blueGray" stats icon>
              <CardIcon color="blueGray">
                <AttachMoney />
              </CardIcon>
              <div style={{
                display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', padding: 5
              }}
              >
                <Button color="info" onClick={() => { }}>충전</Button>
              </div>

            </CardHeader>

            <CardBody>
              <CashCard classes={classes} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} xl={9}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>광고 비용 (효과) 차트</h4>
            </CardHeader>
            <CardBody>
              <ValueChart />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} xl={12}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>캠페인 내역</h4>
            </CardHeader>
            <CardBody>
              <CampaignTable />
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
