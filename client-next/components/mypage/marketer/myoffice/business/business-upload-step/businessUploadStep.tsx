import { Button, Grid, TextField, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Alert } from '@material-ui/lab';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import { useMarketerUpdateBusinessMutation } from '../../../../../../utils/hooks/mutation/useMarketerUpdateBusinessMutation';
import useBannerUpload from '../../../../../../utils/hooks/useBannerUpload';
import useEventTargetValue from '../../../../../../utils/hooks/useEventTargetValue';

const useStyles = makeStyles(theme => ({
  helperAlert: {
    margin: theme.spacing(2, 0),
  },
  imgPreview: {
    width: 'auto',
    height: 350,
    [theme.breakpoints.down('xs')]: { maxHeight: '200px' },
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgPreviewContainer: {
    backgroundColor: theme.palette.action.disabledBackground,
    height: 100,
    width: '100%',
    margin: theme.spacing(0, 0, 2, 0),
    border: `3px dashed ${theme.palette.divider}`,
  },
  button: {
    display: 'flex',
    justifyContent: 'right',
    marginRight: '5px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  resize: {
    fontSize: 30,
  },
}));

interface StepperInterface {
  handleChangeStep: (index: number) => void;
  isBusiness: boolean;
}

function BusinessUploadStep(props: StepperInterface): JSX.Element {
  const { handleChangeStep, isBusiness } = props;
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const defaultImage = '';
  const defaultNumber = '';
  const { imageUrl, imageName, handleReset, readImage } = useBannerUpload(defaultImage);
  const eventValue = useEventTargetValue(defaultNumber);
  const businessUpdateMutation = useMarketerUpdateBusinessMutation();
  const phoneRex = /^\d{3}-\d{3,4}-\d{4}$/;

  return (
    <div>
      {isBusiness ? (
        <div>
          <Alert severity="info" className={classes.helperAlert}>
            <Typography variant="body2">* 이미지 또는 PDF 파일을 업로드할 수 있습니다.</Typography>
            <Typography variant="body2">* PDF 파일은 미리보기가 지원되지 않습니다.</Typography>
            <Typography variant="body2">* 5MB를 초과하는 파일는 업로드 불가능합니다.</Typography>
          </Alert>
          <span className={classes.container}>
            {/* 이미지 없을 때 */}
            {!imageUrl && (
              <div className={classnames(classes.imgPreviewContainer, classes.container)}>
                <Typography variant="body2">
                  <Typography component="span" color="primary" variant="body2">
                    파일찾기
                  </Typography>{' '}
                  버튼을 눌러 파일(이미지/PDF)을 업로드해주세요.
                </Typography>
              </div>
            )}
            {/* 업로드한 파일이 pdf가 아닌 이미지 파일일 때 */}
            {imageUrl && imageUrl.indexOf('application/pdf') === -1 && (
              <img
                id="preview"
                src={imageUrl}
                className={classes.imgPreview}
                onError={handleReset}
                alt="business-registration-preview"
              />
            )}
            {/* 업로드한 파일이 PDF일 때 */}
            {imageName &&
              (imageName.indexOf('.pdf') > -1 || // pdf 확장자거나
                (imageUrl && imageUrl?.indexOf('application/pdf') > -1)) && ( // base64 타입이 pdf 인 경우
                <div>
                  <Typography variant="body2">PDF 파일은 미리보기가 지원되지 않습니다.</Typography>
                  <Typography variant="body2" color="primary">
                    {imageName}
                  </Typography>
                </div>
              )}
          </span>

          <span className="filebox">
            <Grid container direction="row" justifyContent="flex-end">
              <Grid item className={classes.container}>
                {/* <Hidden smDown> */}
                <input className="upload-name" value={imageName || ''} disabled />
                {/* </Hidden> */}
              </Grid>
              <Grid item className={classes.container}>
                <Button component="span" color="primary">
                  <label htmlFor="getfile">
                    <input
                      type="file"
                      id="getfile"
                      accept="image/*, application/pdf"
                      onChange={readImage}
                    />
                    <Typography>파일찾기</Typography>
                  </label>
                </Button>
              </Grid>
            </Grid>
          </span>

          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={(): void => {
                handleReset();
              }}
            >
              초기화
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={async (): Promise<void> => {
                await businessUpdateMutation
                  .mutateAsync({ value: imageUrl })
                  .then(() => {
                    enqueueSnackbar('파일 등록 성공', { variant: 'success' });
                    handleChangeStep(2);
                  })
                  .catch(() =>
                    enqueueSnackbar(
                      '등록에 실패했습니다. 문제가 지속될 경우 support@onad.io로 문의바랍니다.',
                      { variant: 'error' },
                    ),
                  );
              }}
              disabled={!imageName}
            >
              등록
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <span className={classes.container}>
            <TextField
              label="현금 영수증 번호 입력"
              placeholder="(000) - 0000 - 0000"
              value={eventValue.value}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
              error={!phoneRex.test(eventValue.value)}
              helperText={!phoneRex.test(eventValue.value) ? '휴대전화번호를 입력해 주세요' : ''}
              onChange={eventValue.handleChangePhoneNumber}
            />
          </span>

          <span className={classes.buttonWrapper}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={(): void => {
                eventValue.handleReset();
              }}
            >
              초기화
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={async (): Promise<void> => {
                await businessUpdateMutation
                  .mutateAsync({ value: eventValue.value })
                  .then(() => handleChangeStep(2))
                  .catch(() =>
                    enqueueSnackbar(
                      '등록에 실패했습니다. 문제가 지속될 경우 support@onad.io로 문의바랍니다.',
                      { variant: 'error' },
                    ),
                  );
              }}
              disabled={!eventValue.value || !phoneRex.test(eventValue.value)}
            >
              등록
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}

export default BusinessUploadStep;
