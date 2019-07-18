import React from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import axios from '../../../../../utils/axios';
// customized component
import Button from '../../../components/CustomButtons/Button';
import Dialog from '../../../components/Dialog/Dialog';
import Warning from '../../../components/Typography/Warning';
import HOST from '../../../../../config';


const useStyles = makeStyles(theme => ({
  inDialogContent: {
    padding: theme.spacing(1),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  contentWrapper: {
    margin: '20px 0px 20px 0px',
  },
  contentTitle: {
    fontWeight: 'bold',
  },
  contentDetail: {
    marginTop: theme.spacing(1),
  },
  inDialogButton: {
    textAlign: 'center',
  },
  selectValue: {
    color: '#333',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  dialog: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  dialogContent: {
    marginBottom: theme.spacing(1),
  },
}));

function useWithdrawalConfirmDialog(handleClose) {
  const [withdrawalConfirmDialog, setWithdrawalConfirmDialog] = React.useState(false);

  function handleConfirmDialogClose() {
    setWithdrawalConfirmDialog(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose() {
    setWithdrawalConfirmDialog(false);
  }

  function handleConfirmDialogOpen() {
    setWithdrawalConfirmDialog(true);
  }

  return {
    withdrawalConfirmDialog,
    handleConfirmDialogClose,
    handleOnlyDialogClose,
    handleConfirmDialogOpen,
  };
}

function useValue(defaultValue) {
  const [selectValue, setValue] = React.useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { selectValue, handleChange };
}

function WithdrawDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, accountNumber, receivable, history,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('0');

  // 출금신청 스낵바
  const {
    withdrawalConfirmDialog, handleConfirmDialogClose,
    handleOnlyDialogClose, handleConfirmDialogOpen,
  } = useWithdrawalConfirmDialog(handleClose);

  // 결제 진행 버튼 클릭
  function handleClick() {
    handleConfirmDialogOpen();
  }

  function handleSubmitClick() {
    if (receivable - selectValue < 0) {
      alert('장난치지마세요!!!');
    } else if (selectValue < 30000) {
      alert('3만원 이상부터 출금이 가능해요!');
    } else {
      // 해당 금액 만큼 출금 내역에 추가하는 요청
      axios.post(`${HOST}/api/dashboard/creator/withdrawal`, {
        withdrawalAmount: selectValue,
      }).then((res) => {
        if (!res.data.error) {
          handleConfirmDialogClose();
          alert('출금 신청이 완료되었습니다.');
          history.push(window.location.pathname);
        } else {
          alert('현재는 출금 신청이 불가능하오니 잠시 후 시도해주시기 바랍니다.');
          history.push(window.location.pathname);
        }
      }).catch((err) => {
        alert('현재는 출금 신청이 불가능하오니 잠시 후 시도해주시기 바랍니다.');
        history.push(window.location.pathname);
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="출금 신청"
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="info"
            onClick={handleClick}
            disabled={(!(receivable >= selectValue)) || !(selectValue > 0)}
          >
              진행
          </Button>
          <Button onClick={handleClose}>
              취소
          </Button>

        </div>
      )}
    >
      <div className={classes.Dialog}>

        {/* 모달내용 */}
        <div className={classes.inDialogContent}>
          {/* 출금계좌 */}
          <div className={classes.contentWrapper}>
            <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
            입금 계좌
            </Typography>
            <Typography
              variant="h5"
              id="select-account"
              className={classes.contentDetail}
            >
              {`${accountNumber.split('_')[0]}   ${accountNumber.split('_')[1]}`}
            </Typography>
          </div>
          <Divider />

          {/* 출금가능금액 */}
          <div className={classes.contentWrapper}>
            <Typography className={classes.contentTitle} variant="subtitle1">
            출금 가능 금액
            </Typography>
            <Typography
              variant="h4"
              id="select-account"
              className={classes.contentDetail}
            >
              {`${receivable} 원`}
            </Typography>
          </div>
          <Divider />

          {/* 출금금액입력 */}
          <div className={classes.contentWrapper} style={{ position: 'relative', width: 150 }}>
            <Typography className={classes.contentTitle} variant="subtitle1">
              출금 금액
            </Typography>
            <RadioGroup
              name="howmuch"
              className={classes.contentDetail}
              value={selectValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="30000"
                control={<Radio color="primary" />}
                label={
                  receivable >= 30000
                    ? (
                      <Typography variant="h6" className={classes.selectValue}>
                    30,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h6">
                    30,000 원
                      </Typography>
                    )
                }
                disabled={!(receivable >= 30000)}
              />
              <FormControlLabel
                value="50000"
                control={<Radio color="primary" />}
                label={
                  receivable >= 50000
                    ? (
                      <Typography variant="h6" className={classes.selectValue}>
                    50,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h6">
                    50,000 원
                      </Typography>
                    )
                }
                disabled={!(receivable >= 50000)}
              />
              <FormControlLabel
                value="100000"
                control={<Radio color="primary" />}
                label={
                  receivable >= 100000
                    ? (
                      <Typography variant="h6" className={classes.selectValue}>
                    100,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h6">
                    100,000 원
                      </Typography>
                    )
                }
                disabled={!(receivable >= 100000)}
              />
            </RadioGroup>
            <div style={{ position: 'absolute', top: 50, left: 200 }}>
              <Tooltip title="직접입력도 가능합니다.">
                <TextField
                  id="selectValue"
                  label={(
                    <Typography variant="h6" className={classes.selectValue}>
                    출금할 금액을 입력하세요
                    </Typography>
                  )}
                  type="number"
                  className={classes.textField}
                  value={selectValue}
                  onChange={handleChange}
                  margin="normal"
                  error={(!(receivable >= selectValue)) || !(selectValue >= 0)}
                  variant="outlined"
                  helperText={((receivable >= selectValue) && (selectValue >= 0)) ? '' : '입력이 잘못되었어요!'}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        {/* 출금 신청 완료 시의 notification */}
        <Dialog
          open={withdrawalConfirmDialog}
          onClose={handleConfirmDialogClose}
          buttons={(
            <div>
              <Button onClick={handleSubmitClick} color="info">
              확인
              </Button>
              <Button onClick={handleOnlyDialogClose}>
              취소
              </Button>
            </div>
          )}
        >
          <DialogContent className={classes.dialog}>
            <Typography className={classes.dialogContent} variant="h5" marked="center">
              {`출금 신청액 : ${selectValue}`}
            </Typography>
            <Typography className={classes.dialogContent} variant="h5" marked="center">
              {`출금 이후 잔여 출금 가능 금액 : ${receivable - selectValue}`}
            </Typography>
            <Warning>
              <Typography variant="h6" marked="center">
                {'입금까지 하루 또는 이틀이 소요되어요!!'}
              </Typography>
            </Warning>
          </DialogContent>
        </Dialog>

      </div>
    </Dialog>
  );
}

WithdrawDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  receivable: PropTypes.number.isRequired,
};

export default WithdrawDialog;
