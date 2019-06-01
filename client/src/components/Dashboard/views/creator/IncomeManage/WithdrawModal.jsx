import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from 'axios';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// icons
import Close from '@material-ui/icons/CloseOutlined';
// customized component
import Button from '../../../components/CustomButtons/Button';
import Warning from '../../../components/Typography/Warning';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  inModalContent: {
    padding: theme.spacing(3),
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
  inModalButton: {
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

function useWithdrawalSnack(handleClose) {
  const [withdrawalSnack, setWithdrawalSnack] = React.useState(false);

  function handleSnackClose() {
    setWithdrawalSnack(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose() {
    setWithdrawalSnack(false);
  }

  function handleSnackOpen() {
    setWithdrawalSnack(true);
  }

  return {
    withdrawalSnack, handleSnackClose, handleOnlyDialogClose, handleSnackOpen,
  };
}

function useValue(defaultValue) {
  const [selectValue, setValue] = React.useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { selectValue, handleChange };
}

function WithdrawModal(props) {
  const classes = useStyles();
  const {
    open, handleClose, accountNumber, receivable, history,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('10000');

  // 출금신청 스낵바
  const {
    withdrawalSnack, handleSnackClose, handleOnlyDialogClose, handleSnackOpen,
  } = useWithdrawalSnack(handleClose);

  // 결제 진행 버튼 클릭
  function handleClick() {
    handleSnackOpen();
  }

  function handleSubmitClick() {
    if (receivable - selectValue < 0) {
      alert('장난치지마세요!!!');
    } else {
      // 해당 금액 만큼 출금 내역에 추가하는 요청
      axios.post('/dashboard/creator/withdrawal', {
        withdrawalAmount: selectValue,
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });

      handleSnackClose();
      history.push('/dashboard/income');
    }
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={handleClose}
    >
      <div className={classes.modal}>
        {/* 상위 바 */}
        <AppBar color="primary" position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
            출금 신청
            </Typography>
            <div className={classes.sectionButton}>
              <IconButton color="inherit" onClick={handleClose}>
                <Close />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* 모달내용 */}
        <div className={classes.inModalContent}>
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
                value="10000"
                control={<Radio color="primary" />}
                label={
                  receivable > 10000
                    ? (
                      <Typography variant="h6" className={classes.selectValue}>
                    10,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h6">
                    10,000 원
                      </Typography>
                    )
                  }
                disabled={!(receivable > 10000)}
              />
              <FormControlLabel
                value="30000"
                control={<Radio color="primary" />}
                label={
                  receivable > 30000
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
                disabled={!(receivable > 30000)}
              />
              <FormControlLabel
                value="50000"
                control={<Radio color="primary" />}
                label={
                  receivable > 50000
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
                disabled={!(receivable > 50000)}
              />
              <FormControlLabel
                value="100000"
                control={<Radio color="primary" />}
                label={
                  receivable > 100000
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
                disabled={!(receivable > 100000)}
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

          {/* 버튼 */}
          <div className={classnames(classes.contentWrapper, classes.inModalButton)}>
            <Button onClick={handleClose}>
              취소
            </Button>
            <Button
              color="info"
              onClick={handleClick}
              disabled={(!(receivable >= selectValue)) || !(selectValue >= 0)}
            >
              진행
            </Button>
          </div>
        </div>
        {/* 출금 신청 완료 시의 notification */}
        <Dialog
          open={withdrawalSnack}
          keepMounted
          onClose={handleSnackClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AppBar color="primary" position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit">
                입력하신대로 출금 진행하시겠어요?
              </Typography>
              <div className={classes.sectionButton}>
                <IconButton color="inherit" onClick={handleOnlyDialogClose}>
                  <Close />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>

          <Divider />
          <DialogContent className={classes.dialog}>
            <Typography className={classes.dialogContent} variant="h5" marked="center">
              {`출금 신청액 : ${selectValue}`}
            </Typography>
            <Typography className={classes.dialogContent} variant="h5" marked="center">
              {`출금 이후 잔여 출금 가능 금액 : ${receivable - selectValue}`}
            </Typography>
            <Warning>
              <Typography className={classes.dialogContent} variant="h6" marked="center">
                {'입금까지 하루 또는 이틀이 소요되어요!!'}
              </Typography>
            </Warning>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnlyDialogClose}>
              취소
            </Button>
            <Button onClick={handleSubmitClick} color="info">
              진행
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </Modal>
  );
}

WithdrawModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  receivable: PropTypes.number.isRequired,
};

export default WithdrawModal;
