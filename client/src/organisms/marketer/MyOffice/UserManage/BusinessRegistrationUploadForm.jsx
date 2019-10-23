import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Button from '../../../../atoms/CustomButtons/Button';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import BusinessRegiUploadDialog from './BusinessRegiUploadDialog';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
// hooks
import useDialog from '../../../../utils/lib/hooks/useDialog';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',

  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));
function BusinessRegistrationUploadForm(props) {
  const myClasses = useStyles();
  const { classes, businessRegistrationData } = props;
  const { open, handleOpen, handleClose } = useDialog();
  const snack = useDialog();

  return (
    <Card>
      <CardHeader color="blueGray">
        <div className={myClasses.textBox}>
          <h4 className={classes.cardTitleWhite}>
            사업자 등록증 업로드
          </h4>
        </div>

      </CardHeader>

      {!businessRegistrationData.loading
      && businessRegistrationData.payload.marketerBusinessRegSrc ? (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
              onClick={() => { handleOpen(); }}
            >
              사업자 등록증 변경
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 5 }}>
            <Typography gutterBottom variant="body1">등록된 사업자 등록번호</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1">
              {businessRegistrationData.payload.marketerBusinessRegNum}
            </Typography>
          </div>
        </CardBody>
        ) : (
          <CardBody>
            <div className={myClasses.buttonWrapper}>
              <Button
                color="info"
                onClick={handleOpen}
              >
              사업자 등록증 등록
              </Button>
            </div>
            <div className={myClasses.textBox} style={{ marginTop: 5 }}>
              <Typography gutterBottom variant="body1">아직 등록된 사업자 등록증이 없습니다.</Typography>
            </div>
            <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
              <Typography gutterBottom variant="body1" style={{ color: '#00acc1' }}>등록</Typography>
              <Typography gutterBottom variant="body1">
              버튼을 눌러 사업자 등록증을 업로드해주세요.
              </Typography>
            </div>
          </CardBody>
        )}

      { !businessRegistrationData.loading && (
        <BusinessRegiUploadDialog
          open={open}
          handleClose={handleClose}
          businessRegiImage={businessRegistrationData.payload.marketerBusinessRegSrc}
          request={businessRegistrationData.callUrl}
          handleSnackOpen={snack.handleOpen}
        />
      )}

      <Snackbar
        place="tc"
        color="success"
        message="사업자 등록증이 등록되었습니다."
        open={snack.open}
        onClose={snack.handleClose}
        closeNotification={() => { snack.handleClose(); }}
        close
      />

    </Card>
  );
}

BusinessRegistrationUploadForm.propTypes = {
  classes: PropTypes.object.isRequired,
  businessRegistrationData: PropTypes.object
};

BusinessRegistrationUploadForm.defaultProps = {
  businessRegistrationData: {
    loading: true,
    error: '',
    payload: {
      marketerBusinessRegSrc: ''
    }
  }
};

export default withStyles(DashboardStyle)(BusinessRegistrationUploadForm);
