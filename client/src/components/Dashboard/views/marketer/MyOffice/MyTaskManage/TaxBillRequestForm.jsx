import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
// own components
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import Button from '../../../../components/CustomButtons/Button';
import Snackbar from '../../../../components/Snackbar/Snackbar';

import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import useDialog from '../../../../lib/hooks/useDialog';
import TaxBillRequestDialog from './TaxBillRequestDialog';


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
  const { classes, businessRegistrationData, userData } = props;
  const { open, handleOpen, handleClose } = useDialog();
  const snack = useDialog();

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
          {!businessRegistrationData.loading
          && businessRegistrationData.payload.marketerBusinessRegNum ? (
            <Button
              color="info"
              onClick={handleOpen}
            >
            세금계산서 신청
            </Button>
            ) : (
              <Tooltip title="사업자 등록증을 업로드하지 않아 진행이 불가합니다.">
                <div>
                  <Button
                    color="info"
                    disabled
                  >
            세금계산서 신청
                  </Button>
                </div>
              </Tooltip>
            )}
        </div>
        <div className={myClasses.textBox} style={{ marginTop: 5 }}>
          <Typography gutterBottom variant="body1">세금계산서 발행 신청은</Typography>
        </div>
        <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
          <Typography gutterBottom variant="body1">
            위의
          </Typography>
          <Typography gutterBottom variant="body1" style={{ color: '#00acc1' }}>
            &emsp;신청버튼
          </Typography>
          <Typography gutterBottom variant="body1">
            으로 진행해주세요
          </Typography>
        </div>
      </CardBody>

      {!businessRegistrationData.loading && !userData.loading
        && businessRegistrationData.payload.marketerBusinessRegNum && (
        <TaxBillRequestDialog
          open={open}
          handleClose={handleClose}
          data={businessRegistrationData.payload}
          handleSnackOpen={snack.handleOpen}
          userMail={userData.payload.marketerMail}
        />
      )}

      <Snackbar
        place="tc"
        color="success"
        message="세금계산서 신청이 완료되었습니다."
        open={snack.open}
        onClose={snack.handleClose}
        closeNotification={() => { snack.handleClose(); }}
        icon
        close
      />

    </Card>
  );
}

TaxBillRequestForm.propTypes = {
  classes: PropTypes.object.isRequired,
  businessRegistrationData: PropTypes.object,
  userData: PropTypes.object
};

TaxBillRequestForm.defaultProps = {
  businessRegistrationData: {
    loading: true,
    error: '',
    payload: {
      marketerBusinessRegNum: 0,
      marketerBusinessRegSrc: ''
    }
  },
  userData: {
    loading: true,
    error: '',
    payload: {}
  }
};

export default withStyles(DashboardStyle)(TaxBillRequestForm);
