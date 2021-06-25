import { useState } from 'react';
// core
import { Paper, Typography, Button, makeStyles } from '@material-ui/core';
// own components
import BusinessViewDialog from './BusinessViewDialog';

// step dialog
import BusinessUploadStepDialog from './BusinessUploadStepDialog';

// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import useGetRequest, { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { BusinessInterface } from '../interface';
import Table from '../../../../../atoms/Table/Table';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  button: {
    margin: theme.spacing(0, 1, 0, 0),
  },
}));
interface BusinessUploadFormProps {
  businessRegistrationData: UseGetRequestObject<BusinessInterface | null>;
}

function BusinessUploadForm(props: BusinessUploadFormProps): JSX.Element {
  const classes = useStyles();
  const { businessRegistrationData } = props;
  const showDialog = useDialog();
  const snack = useDialog();
  const stepDialog = useDialog();
  const imageRex = /data:image\/([a-zA-Z]*);base64,([^\\"]*)/;
  const pdfRex = /data:application\/pdf;base64,([^\\"]*)/;
  const phoneRex = /^\d{3}-\d{3,4}-\d{4}$/;
  const [step, setStep] = useState({
    currStep: 0,
    isBusiness: false,
  });

  // 목록 데이터
  const { data, loading } = useGetRequest<null, string[][]>('/marketer/tax-bills');

  return (
    <Paper className={classes.root}>
      <Typography style={{ fontWeight: 'bold' }}>세금계산서/현금영수증 발행</Typography>

      {!businessRegistrationData.loading &&
      businessRegistrationData.data &&
      businessRegistrationData.data.marketerBusinessRegSrc ? (
        <div>
          {imageRex.test(businessRegistrationData.data.marketerBusinessRegSrc) ||
          pdfRex.test(businessRegistrationData.data.marketerBusinessRegSrc) ? (
            <>
              <Typography gutterBottom variant="body2">
                사업자 등록증이 업로드 되어 있습니다.
              </Typography>
              <div>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={(): void => {
                    setStep({
                      currStep: 0,
                      isBusiness: true,
                    });
                    stepDialog.handleOpen();
                  }}
                >
                  사업자 등록증 변경
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  className={classes.button}
                  color="secondary"
                  onClick={(): void => {
                    showDialog.handleOpen();
                  }}
                >
                  사업자 등록증 보기
                </Button>
              </div>
            </>
          ) : (
            <>
              {phoneRex.test(businessRegistrationData.data.marketerBusinessRegSrc) ? (
                <span>
                  <Typography gutterBottom align="center" variant="body2">
                    전화번호 : {businessRegistrationData.data.marketerBusinessRegSrc}
                  </Typography>
                  <Typography gutterBottom variant="body2">
                    현금 영수증이 업로드 되어 있습니다.
                  </Typography>
                </span>
              ) : (
                <Typography variant="body2" align="center">
                  전화 번호 형식이 올바르지 않습니다.
                  <br />
                  변경하기를 눌러 다시 등록해주세요
                </Typography>
              )}
              <div>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={(): void => {
                    setStep({ currStep: 0, isBusiness: false });
                    stepDialog.handleOpen();
                  }}
                >
                  현금 영수증 변경
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <Typography gutterBottom variant="body2">
            아직 등록된 [사업자 등록증 혹은 현금 영수증 번호]가 없습니다.
          </Typography>
          <Typography gutterBottom variant="body2">
            진행 버튼을 눌러 필수정보 등록 절차를 진행해주세요.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={(): void => {
              setStep({ currStep: 0, isBusiness: false });
              stepDialog.handleOpen();
            }}
          >
            발행 진행
          </Button>
        </div>
      )}

      {data && (
        <div style={{ marginTop: 16 }}>
          <Typography style={{ fontWeight: 'bold' }}>세금계산서 발행 내역</Typography>
          <Table
            rowPerPage={3}
            tableHead={['날짜', '금액', '발행상태']}
            tableData={loading || data === null ? [] : data}
            pagination
          />
        </div>
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
    </Paper>
  );
}

export default BusinessUploadForm;
