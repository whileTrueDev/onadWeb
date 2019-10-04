import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
// core ../../../atoms
import AttachMoney from '@material-ui/icons/AttachMoney';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import Card from '../../atoms/Card/Card';
import CardHeader from '../../atoms/Card/CardHeader';
import CardBody from '../../atoms/Card/CardBody';
import Button from '../../atoms/CustomButtons/Button';
import ValueChart from '../../organisms/marketer/Dashboard/ValueChart';
import CashCard from '../../organisms/marketer/Dashboard/CashCard';
import StatusBar from '../../organisms/marketer/Dashboard/CampaignOnOffSwitch';
import CardIcon from '../../atoms/Card/CardIcon';

import dashboardStyle from '../../assets/jss/onad/views/dashboardStyle';
import CampaignList from '../../organisms/marketer/Dashboard/CampaignList';

import useFetchData from '../../utils/lib/hooks/useFetchData';

const Dashboard = (props) => {
  const { classes } = props;
  const marketerOnOffData = useFetchData('/api/dashboard/marketer/onoff');
  const marketerProfileData = useFetchData('/api/dashboard/marketer/profile');
  const campaignData = useFetchData('/api/dashboard/marketer/campaign/list');
  const bannerData = useFetchData('/api/dashboard/marketer/banner');

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} md={12} xl={12}>
          <Card style={{ marginBottom: 0 }}>
            <StatusBar onOffData={marketerOnOffData} />
          </Card>
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
              <CashCard
                classes={classes}
                marketerProfileData={marketerProfileData}
                campaignData={campaignData}
                bannerData={bannerData}
              />
            </CardBody>
          </Card>
        </GridItem>
        <Hidden xsDown>
          <GridItem sm={12} xl={9}>
            <Card>
              <CardHeader color="blueGray">
                <h4 className={classes.cardTitleWhite}>광고 비용 (효과) 차트</h4>
              </CardHeader>
              <CardBody>
                <ValueChart />
              </CardBody>
            </Card>
          </GridItem>
        </Hidden>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} xl={12}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>캠페인 내역</h4>
            </CardHeader>
            <CardBody>
              <CampaignList
                campaignData={campaignData}
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
