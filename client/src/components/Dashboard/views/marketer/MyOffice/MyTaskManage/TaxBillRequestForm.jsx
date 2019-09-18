import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import Button from '../../../../components/CustomButtons/Button';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';

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
function TaxBillRequestForm(props) {
  const myClasses = useStyles();
  const { classes } = props;

  return (
    <Card>
      <CardHeader color="blueGray">
        <div className={myClasses.textBox}>
          <h4 className={classes.cardTitleWhite}>
            세금계산서 발행 신청
          </h4>
        </div>

      </CardHeader>


      <CardBody>
        <div className={myClasses.buttonWrapper}>
          <Button
            color="info"
            // onClick={handleClick}
          >
            세금계산서 신청
          </Button>
        </div>
        <div className={myClasses.textBox} style={{ marginTop: 5 }}>
          <Typography gutterBottom variant="body1">발행에 대한 설명</Typography>
        </div>
        <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
          <Typography gutterBottom variant="body1">
            세금계산서 프로세스를 잘 몰라서 일단은 보류
          </Typography>
        </div>
      </CardBody>

    </Card>
  );
}

TaxBillRequestForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(TaxBillRequestForm);
