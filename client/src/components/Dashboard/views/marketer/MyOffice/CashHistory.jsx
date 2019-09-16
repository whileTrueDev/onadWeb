import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DateRange from '@material-ui/icons/DateRange';
// own components
import Button from '../../../components/CustomButtons/Button';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardFooter from '../../../components/Card/CardFooter';
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';


function RefundAccountForm(props) {
  const { classes } = props;

  return (
    <Card>
      <CardHeader color="blueGray" stats icon>
        <CardIcon color="blueGray">
          <AttachMoney />
        </CardIcon>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className={classes.cardCategory} style={{ position: 'relative', top: 10 }}>보유 광고캐시</p>
            <h3 className={classes.cardTitle} style={{ position: 'relative', top: 10 }}>
              {'100,000,000'}
              <small>원</small>
            </h3>
          </div>

          <div>
            <Button color="info">충전</Button>
            <Button color="danger">환불</Button>

          </div>
        </div>

      </CardHeader>
      {/* <CardBody>
        <Button>충전</Button>
        <Button>환불</Button>
      </CardBody> */}
      <CardFooter stats>
        <div className={classes.stats}>
          <DateRange />
          <span>Updated : asdfasdf월asdf</span>
        </div>
      </CardFooter>
    </Card>
  );
}

RefundAccountForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(RefundAccountForm);
