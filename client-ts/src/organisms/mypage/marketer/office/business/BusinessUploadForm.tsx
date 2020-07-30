import React from 'react';
// core
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
// own components
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import Button from '../../../../../atoms/CustomButtons/Button';
import DashboardStyle from '../../../../../assets/jss/views/dashboardStyle';
import BusinessViewDialog from './BusinessViewDialog';

// step dialog
import BusinessUploadStepDialog from './BusinessUploadStepDialog';

// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { BusinessInterface } from '../interface';

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
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

interface BusinessUploadFormProps {
  classes: any;
  businessRegistrationData: UseGetRequestObject<BusinessInterface | null>;
}

function BusinessUploadForm(props: BusinessUploadFormProps): JSX.Element {
  const myClasses = useStyles();
  const { classes, businessRegistrationData } = props;
  const showDialog = useDialog();
  const snack = useDialog();
  const stepDialog = useDialog();
  const imageRex = /data:image\/([a-zA-Z]*);base64,([^\\"]*)/;
  const phoneRex = /^\d{3}-\d{3,4}-\d{4}$/;
  const [step, setStep] = React.useState({
    currStep: 0,
    isBusiness: false
  });

  return (
    <Card>
      <CardHeader color="blueGray">
        <div className={myClasses.textBox}>
          <Typography variant="h6">
            세금계산서/현금영수증 발행
          </Typography>
        </div>

      </CardHeader>
      {!businessRegistrationData.loading
        && businessRegistrationData.data && businessRegistrationData.data.marketerBusinessRegSrc ? (

          <CardBody>
            {imageRex.test(businessRegistrationData.data.marketerBusinessRegSrc) ? (
              <>
                <div className={myClasses.buttonWrapper}>
                  <Button
                    color="primary"
                    onClick={(): void => {
                      setStep({
                        currStep: 1,
                        isBusiness: true
                      });
                      stepDialog.handleOpen();
                    }}
                  >
                    사업자 등록증 변경
                  </Button>
                  <Button
                    color="secondary"
                    onClick={(): void => { showDialog.handleOpen(); }}
                  >
                    사업자 등록증 보기
                  </Button>
                </div>
                <div className={myClasses.textBox} style={{ marginTop: 5 }}>
                  <Typography gutterBottom variant="body1">사업자 등록증이 업로드 되어 있습니다.</Typography>
                </div>
              </>
            ) : (
              <>
                <div className={myClasses.buttonWrapper}>
                  <Button
                    color="primary"
                    onClick={(): void => {
                      setStep({
                        currStep: 1,
                        isBusiness: false
                      });
                      stepDialog.handleOpen();
                    }}
                  >
                    현금 영수증 변경
                  </Button>
                </div>
                {phoneRex.test(businessRegistrationData.data.marketerBusinessRegSrc) ? (
                  <span>
                    <Typography gutterBottom align="center">
                      전화번호 :
                      {' '}
                      {businessRegistrationData.data.marketerBusinessRegSrc}
                    </Typography>
                    <div className={myClasses.textBox} style={{ marginTop: 5 }}>
                      <Typography gutterBottom>현금 영수증이 업로드 되어 있습니다.</Typography>
                    </div>
                  </span>
                ) : (
                  <Typography variant="body1" align="center">
                    전화 번호 형식이 올바르지 않습니다.
                    <br />
                    변경하기를 눌러 다시 등록해주세요
                  </Typography>
                )}
              </>
            )}

          </CardBody>
        ) : (
          <CardBody>
            <div className={myClasses.buttonWrapper} style={{ marginRight: 5 }}>
              <Button
                color="primary"
                onClick={(): void => {
                  setStep({
                    currStep: 0,
                    isBusiness: false
                  });
                  stepDialog.handleOpen();
                }}
                size="medium"
              >
                발행 진행
              </Button>
            </div>
            <div className={myClasses.textBox} style={{ marginTop: 5 }}>
              <Typography gutterBottom variant="body1">아직 등록된 [사업자 등록증 혹은 현금 영수증 번호]가 없습니다.</Typography>
            </div>
            <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
              <Typography gutterBottom variant="body1" className={classes.success}>진행</Typography>
              <Typography gutterBottom variant="body1">
                버튼을 눌러 필수정보 등록 절차를 진행해주세요.
              </Typography>
            </div>
          </CardBody>
        )}

      {!businessRegistrationData.loading && businessRegistrationData.data && (
      <BusinessUploadStepDialog
        open={stepDialog.open}
        handleClose={stepDialog.handleClose}
        businessRegiImage={businessRegistrationData.data.marketerBusinessRegSrc}
        request={businessRegistrationData.doGetRequest}
        handleSnackOpen={snack.handleOpen}
        step={step}
      />
      )}

      {!businessRegistrationData.loading && businessRegistrationData.data && (
        <BusinessViewDialog
          open={showDialog.open}
          handleClose={showDialog.handleClose}
          businessRegiImage={businessRegistrationData.data.marketerBusinessRegSrc}
          request={businessRegistrationData.doGetRequest}
          handleSnackOpen={snack.handleOpen}
          step={step}
        />
      )}
    </Card>
  );
}

export default withStyles(DashboardStyle)(BusinessUploadForm);
