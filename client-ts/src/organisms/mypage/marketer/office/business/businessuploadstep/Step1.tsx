import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../../../atoms/CustomButtons/Button';

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
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}));

interface StepperInterface{
  handleChangeStep: (index: number) => void;
  handleIsBusiness: (stepIndex: boolean) => void;
}

export default function Step1(props: StepperInterface): JSX.Element {
  const classes = useStyles();
  const { handleChangeStep, handleIsBusiness } = props;

  return (
    <div className={classes.container}>
      <Button
        onClick={(): void => {
          handleChangeStep(1);
          handleIsBusiness(true);
        }}
      >
            사업자 등록증 업로드
      </Button>
      <Button
        onClick={(): void => {
          handleChangeStep(1);
          handleIsBusiness(false);
        }}
      >
            현금 영수증 업로드
      </Button>
    </div>
  );
}
