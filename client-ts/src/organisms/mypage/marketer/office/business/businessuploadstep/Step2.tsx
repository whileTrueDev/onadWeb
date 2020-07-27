
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Button as UploadButton, Typography, Grid, TextField
} from '@material-ui/core';
import Button from '../../../../../../atoms/CustomButtons/Button';
import useImageUpload from '../../../../../../utils/hooks/useImageUpload';
import useEventTargetValue from '../../../../../../utils/hooks/useEventTargetValue';
import usePutRequest from '../../../../../../utils/hooks/usePutRequest';

const useStyles = makeStyles((theme) => ({
  imgInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    marginTop: '4px',
    fontSize: '15px',
  },
  imgPreview: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
      maxHeight: '550px',
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'right',
    marginRight: '5px'
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    fontSize: '12',
    padding: '15px'
  },
  resize: {
    fontSize: 30
  },
}));

interface StepperInterface{
  handleChangeStep: (index: number) => void;
  isBusiness: boolean;
}

interface BusinessRegiUploadDialogProps {
    handleClose: () => void;
    businessRegiImage: string;
    request: () => void;
    handleSnackOpen?: () => void;
}

export default function Step2(props: StepperInterface&BusinessRegiUploadDialogProps): JSX.Element {
  const {
    handleChangeStep, isBusiness
  } = props;
  const classes = useStyles();
  const defaultImage = '/pngs/logo/onad_logo_vertical_small.png';
  const defaultNumber = '';

  const {
    imageUrl, imageName, handleReset, readImage
  } = useImageUpload(defaultImage);
  const eventValue = useEventTargetValue(defaultNumber);

  const imageUpload = usePutRequest('/marketer/business', () => {
    handleChangeStep(2);
  });
  const numberUpload = usePutRequest('/marketer/business', () => {
    handleChangeStep(2);
  });

  return (
    <div>
      {isBusiness
        ? (

          <div>
            <span className={classes.container}>
              <img
                id="preview"
                src={(typeof imageUrl === 'string' && imageUrl.indexOf('pdf') === -1) ? imageUrl : defaultImage}
                className={classes.imgPreview}
                onError={handleReset}
                alt="business-registration-preview"
              />
            </span>
            <span className={classes.buttonWrapper}>
              <Button
                className={classes.button}
                onClick={(): void => {
                  handleReset();
                }}
              >
                취소
              </Button>
              <Button
                color="primary"
                className={classes.button}
                onClick={async (): Promise<void> => {
                  await imageUpload.doPutRequest({ value: imageUrl });
                }}
                disabled={!imageName}
              >
                등록
              </Button>
            </span>

            <span className="filebox">
              <Grid container direction="row" justify="flex-end">
                <Grid item className={classes.container}>
                  {/* <Hidden smDown> */}
                  <input className="upload-name" value={imageName || ''} disabled />
                  {/* </Hidden> */}
                </Grid>
                <Grid item component="span" className={classes.container}>
                  <UploadButton component="span" color="primary">
                    <label htmlFor="getfile">
                      <Typography component="span" className={classes.imgInput}>
                        파일찾기
                      </Typography>
                    </label>
                  </UploadButton>
                  <input type="file" id="getfile" accept="image/*, application/pdf" onChange={readImage} />
                </Grid>
              </Grid>
            </span>
          </div>
        )
        : (
          <div>
            <span className={classes.container}>
              <TextField
                label="현금 영수증 번호 입력"
                type="tel"
                placeholder="(000) - 0000 - 0000"
                value={eventValue.value}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
                onChange={eventValue.handleChange}
              />
            </span>

            <span className={classes.buttonWrapper}>
              <Button
                className={classes.button}
                onClick={(): void => {
                  eventValue.handleReset();
                }}
              >
                취소
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={async (): Promise<void> => {
                  await numberUpload.doPutRequest({ value: eventValue.value });
                }}
                disabled={!eventValue.value}
              >
                등록
              </Button>
            </span>
          </div>
        )}
    </div>
  );
}
