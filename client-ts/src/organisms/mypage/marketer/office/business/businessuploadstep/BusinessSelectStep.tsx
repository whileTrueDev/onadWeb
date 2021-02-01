import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

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

export default function BusinessSelectStep(props: StepperInterface): JSX.Element {
  const classes = useStyles();
  const { handleChangeStep, handleIsBusiness } = props;

  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        onClick={(): void => {
          handleChangeStep(1);
          handleIsBusiness(true);
        }}
      >
        세금계산서 발행
        <br />
        (사업자 등록증 업로드)
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={(): void => {
          handleChangeStep(1);
          handleIsBusiness(false);
        }}
      >
        현금영수증 발행
        <br />
        (휴대전화 번호 업로드)
      </Button>
    </div>
  );
}
