import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import Button from '../../../components/CustomButtons/Button';
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));
function RefundAccountForm(props) {
  const myClasses = useStyles();
  const { classes } = props;
  const [AccountNumber, setAccountNumber] = React.useState(null);

  return (
    <Card>
      <CardHeader color="blueGray">
        <div className={myClasses.textBox}>
          <h4 className={classes.cardTitleWhite}>
            환불 계좌 정보
          </h4>
        </div>

      </CardHeader>


      { AccountNumber ? (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
            >
            환불계좌 변경
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 20 }}>
            <Typography gutterBottom variant="body1">등록된 계좌</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 20 }}>
            <Typography gutterBottom variant="body1">
              {AccountNumber}
            </Typography>
          </div>
        </CardBody>
      ) : (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
            >
            환불계좌 등록
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 20 }}>
            <Typography gutterBottom variant="body1">아직 등록된 환불계좌가 없습니다.</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 20 }}>
            <Typography gutterBottom variant="body1" style={{ color: '#00acc1' }}>등록</Typography>
            <Typography gutterBottom variant="body1">
              버튼을 눌러 환불계좌를 등록해주세요.
            </Typography>
          </div>
        </CardBody>
      )}


    </Card>
  );
}

RefundAccountForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(RefundAccountForm);
