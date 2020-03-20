import React from 'react';
// core
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import Button from '../../../../../atoms/CustomButtons/Button';
import DashboardStyle from '../../../../../assets/jss/views/dashboardStyle';
import BusinessRegiUploadDialog from './BusinessUploadDialog';
// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { businessInterface } from '../interface';

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',

  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    color: theme.palette.primary.main
  }
}));

interface propInterface {
  classes: any;
  businessRegistrationData: UseGetRequestObject<businessInterface | null>;
}

function BusinessUploadForm(props: propInterface) {
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
        && businessRegistrationData.data && businessRegistrationData.data.marketerBusinessRegSrc ? (
          <CardBody>
            <div className={myClasses.buttonWrapper}>
              <Button
                color="primary"
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
                {businessRegistrationData.data.marketerBusinessRegNum}
              </Typography>
            </div>
          </CardBody>
        ) : (
          <CardBody>
            <div className={myClasses.buttonWrapper}>
              <Button
                color="primary"
                onClick={() => { handleOpen(); }}
                size="medium"
              >
                사업자 등록증 등록
              </Button>
            </div>
            <div className={myClasses.textBox} style={{ marginTop: 5 }}>
              <Typography gutterBottom variant="body1">아직 등록된 사업자 등록증이 없습니다.</Typography>
            </div>
            <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
              <Typography gutterBottom variant="body1" className={classes.success}>등록</Typography>
              <Typography gutterBottom variant="body1">
                버튼을 눌러 사업자 등록증을 업로드해주세요.
              </Typography>
            </div>
          </CardBody>
        )}

      {!businessRegistrationData.loading && businessRegistrationData.data && (
        <BusinessRegiUploadDialog
          open={open}
          handleClose={handleClose}
          businessRegiImage={businessRegistrationData.data.marketerBusinessRegSrc}
          request={businessRegistrationData.doGetRequest}
          handleSnackOpen={snack.handleOpen}
        />
      )}

      {/* <Snackbar
        place="tc"
        color="success"
        message="사업자 등록증이 등록되었습니다."
        open={snack.open}
        onClose={snack.handleClose}
        closeNotification={() => { snack.handleClose(); }}
        close
      /> */}

    </Card>
  );
}

export default withStyles(DashboardStyle)(BusinessUploadForm);
