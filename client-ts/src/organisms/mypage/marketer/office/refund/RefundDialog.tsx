import { Collapse, Grid, Slide } from '@material-ui/core';
// material ui core
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useReducer } from 'react';
import Button from '../../../../../atoms/CustomButtons/Button';
// customized component
import Dialog from '../../../../../atoms/Dialog/Dialog';
import history from '../../../../../history';
import { useMarketerCreateCashRefundMutation } from '../../../../../utils/hooks/mutation/useMarketerCreateCashRefundMutation';
import { stepReducer } from '../interface';
import sources from '../sources';
import RefundAgreement from './RefundAgreement';
import RefundAmount from './RefundAmount';
import RefundComplete from './RefundComplete';
import RefundConfirm from './RefundConfirm';

const useStyles = makeStyles((theme: Theme) => ({
  contentTitle: {
    fontWeight: 'bold',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  paper: {
    maxWidth: '1200px',
    width: '1200px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  button: { marginRight: theme.spacing(1) },
  title: {
    marginTop: 5,
    paddingBottom: 10,
    fontWeight: 600,
  },
  titleWrap: {
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
    color: 'white',
    textAlign: 'center',
  },
}));

interface RefundDialogProps {
  open: boolean;
  handleClose: () => void;
  currentCash: string;
  accountNumber: string;
  accountHolder: string;
}

function RefundDialog(props: RefundDialogProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [stepComplete, setStepComplete] = React.useState(false); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [paperSwitch, setPaperSwitch] = React.useState(true); // animation을 위한 state
  const [index, setIndex] = React.useState(0); // 각 step을 정의하는  state

  const { open, handleClose, currentCash, accountNumber, accountHolder } = props;

  const currentCashNumber = Number(currentCash.replace(/,/gi, ''));

  // 환불 요청 절차에서 사용할(step2) State.
  const [stepState, stepDispatch] = useReducer(stepReducer, {
    currentCash: currentCashNumber,
    selectValue: '',
    checked: false,
    totalDebit: 0,
  });

  const { selectValue, checked } = stepState;

  const refundMutation = useMarketerCreateCashRefundMutation();
  function handleSubmitClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();

    // 해당 금액 만큼 환불 내역에 추가하는 요청
    refundMutation
      .mutateAsync({ withdrawCash: selectValue })
      .then(() => {
        setIndex(preIndex => preIndex + 1);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar(
          '환불 신청 중 오류가 발생했습니다. 문제가 지속될 경우 support@onad.io로 문의바랍니다.',
          { variant: 'error' },
        );
        history.push('/mypage/marketer/myoffice/cash');
      });
  }

  const handleNext =
    (go: number | null) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();
      setPaperSwitch(false);
      setStepComplete(false);

      if (index === 1) {
        if (
          currentCashNumber - parseInt(selectValue, 10) < 0 ||
          parseInt(selectValue, 10) <= 1000
        ) {
          alert(
            '환불 신청 금액은 1000원 이하에서는 불가하며 환불 신청 금액이 보유 캐시보다 클 수 없습니다.',
          );
          history.push('/mypage/marketer/myoffice/cash');
        } else {
          setTimeout(() => {
            if (go) {
              setIndex(go);
            } else {
              setIndex(preIndex => preIndex + 1);
            }
            setPaperSwitch(true);
          }, 500);
        }
      } else {
        setTimeout(() => {
          if (go) {
            setIndex(go);
          } else {
            setIndex(preIndex => preIndex + 1);
          }
          setPaperSwitch(true);
        }, 500);
      }
    };

  const handleBack = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    setStepComplete(false);
    setPaperSwitch(false);
    if (index === 0 || index === 1 || index === 2) {
      stepDispatch({ key: 'reset' });
    }
    setTimeout(() => {
      setIndex(preIndex => preIndex - 1);
      setPaperSwitch(true);
    }, 500);
  };

  const setSteps = (_index: number): React.ReactNode => {
    switch (_index) {
      case 0:
        return (
          <RefundAgreement
            setStepComplete={setStepComplete}
            checked={checked}
            dispatch={stepDispatch}
          />
        );
      case 1:
        return (
          <RefundAmount
            setStepComplete={setStepComplete}
            state={stepState}
            dispatch={stepDispatch}
            stepComplete={stepComplete}
            accountNumber={accountNumber}
            accountHolder={accountHolder}
          />
        );
      case 2:
        return (
          <RefundConfirm
            state={stepState}
            accountNumber={accountNumber}
            accountHolder={accountHolder}
          />
        );
      case 3:
        return <RefundComplete state={stepState} />;
      default:
        return <div />;
    }
  };

  const DefaultIndex = (): void => {
    handleClose();
    setIndex(0);
    stepDispatch({ key: 'reset' });
  };

  const finishIndex = (): void => {
    handleClose();
    history.push('/dashboard/marketer/myoffice/cash');
  };

  return (
    <Dialog
      open={open}
      onClose={index !== 3 ? DefaultIndex : finishIndex}
      maxWidth="sm"
      fullWidth
      buttons={
        <div>
          <Grid container direction="row">
            {index === 2 && (
              <Grid item>
                <Collapse in>
                  <Button variant="contained" color="primary" onClick={handleSubmitClick}>
                    신청
                  </Button>
                </Collapse>
              </Grid>
            )}
            {(index === 0 || index === 1) && (
              <Grid item>
                <Collapse in={stepComplete}>
                  <Button variant="contained" color="primary" onClick={handleNext(null)}>
                    다음
                  </Button>
                </Collapse>
              </Grid>
            )}
            {index === 1 || index === 2 ? (
              <Grid item>
                <Button onClick={handleBack} className={classes.button}>
                  뒤로
                </Button>
              </Grid>
            ) : null}
            {index !== 3 && (
              <Grid item>
                <Button onClick={DefaultIndex}>취소</Button>
              </Grid>
            )}
            {index === 3 && (
              <Grid item>
                <Button onClick={finishIndex}>완료</Button>
              </Grid>
            )}
          </Grid>
        </div>
      }
    >
      <div>
        <div className={classes.titleWrap}>
          <div style={{ fontSize: 18, paddingTop: 15 }}>
            OnAD 환불요청 Step {index + 1}
            /4
          </div>
          <h4 className={classes.title}>{sources.titleRefund[index]}</h4>
        </div>
        <Slide
          direction="right"
          in={paperSwitch}
          mountOnEnter
          unmountOnExit
          timeout={{ exit: 500 }}
        >
          <div>{setSteps(index)}</div>
        </Slide>
      </div>
    </Dialog>
  );
}

export default RefundDialog;
