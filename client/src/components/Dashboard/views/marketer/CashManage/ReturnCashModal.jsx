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

function useReturnCashSnack(handleClose) {
  const [ReturnCashSnack, setReturnCashSnack] = React.useState(false);

  function handleSnackClose() {
    setReturnCashSnack(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose() {
    setReturnCashSnack(false);
  }

  function handleSnackOpen() {
    setReturnCashSnack(true);
  }

  return {
    ReturnCashSnack, handleSnackClose, handleOnlyDialogClose, handleSnackOpen,
  };
}

function useValue(defaultValue) {
  const [selectValue, setValue] = React.useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { selectValue, handleChange };
}

function ReturnCashModal(props) {
  const classes = useStyles();
  const {
    open, handleClose, accountNumber, chargeCash, history,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('100000');

  // 캐쉬 환불신청 스낵바
  const {
    ReturnCashSnack, handleSnackClose, handleOnlyDialogClose, handleSnackOpen,
  } = useReturnCashSnack(handleClose);

  // 캐시 환불 진행 버튼 클릭
  function handleClick() {
    handleSnackOpen();
  }

  function handleSubmitClick() {
    if (chargeCash - selectValue < 0) {
      alert('불가합니다');
    } else {
      // 해당 금액 만큼 환불 내역에 추가하는 요청
      axios.post('/dashboard/marketer/return', {
        withdrawCash: selectValue,
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });

      handleSnackClose();
      history.push('/dashboard/cash');
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
            광고캐시 환불
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
          {/* 보유한 광고캐시 금액 */}
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
            환불 가능 금액
            </Typography>
            <Typography
              variant="h4"
              id="select-account"
              className={classes.contentDetail}
            >
              {`${chargeCash} 원`}
            </Typography>
          </div>
          <Divider />

          {/* 출금금액입력 */}
          <div className={classes.contentWrapper} style={{ position: 'relative', width: 150 }}>
            <Typography className={classes.contentTitle} variant="subtitle1">
              광고캐시 환불 금액
            </Typography>
            <RadioGroup
              name="howmuch"
              className={classes.contentDetail}
              value={selectValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="100000"
                control={<Radio color="primary" />}
                label={
                  chargeCash > 100000
                    ? (
                      <Typography variant="h7" className={classes.selectValue}>
                    100,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h7">
                    100,000 원
                      </Typography>
                    )
                  }
                disabled={!(chargeCash > 100000)}
              />
              <FormControlLabel
                value="500000"
                control={<Radio color="primary" />}
                label={
                  chargeCash > 500000
                    ? (
                      <Typography variant="h7" className={classes.selectValue}>
                    500,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h7">
                    500,000 원
                      </Typography>
                    )
                }
                disabled={!(chargeCash > 500000)}
              />
              <FormControlLabel
                value="1000000"
                control={<Radio color="primary" />}
                label={
                  chargeCash > 100000
                    ? (
                      <Typography variant="h7" className={classes.selectValue}>
                    1,000,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h7">
                    1,000,000 원
                      </Typography>
                    )
                }
                disabled={!(chargeCash > 100000)}
              />
              <FormControlLabel
                value="5000000"
                control={<Radio color="primary" />}
                label={
                  chargeCash > 5000000
                    ? (
                      <Typography variant="h7" className={classes.selectValue}>
                    5,000,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="h7">
                    5,000,000 원
                      </Typography>
                    )
                }
                disabled={!(chargeCash > 5000000)}
              />
            </RadioGroup>
            <div style={{ position: 'absolute', top: 50, left: 200 }}>
              <Tooltip title="직접입력 하십시오.">
                <TextField
                  id="selectValue"
                  label={(
                    <Typography variant="h6" className={classes.selectValue}>
                    환불할 금액을 입력하세요
                    </Typography>
                  )}
                  type="number"
                  className={classes.textField}
                  value={selectValue}
                  onChange={handleChange}
                  margin="normal"
                  error={(!(chargeCash >= selectValue)) || !(selectValue >= 0)}
                  variant="outlined"
                  helperText={((chargeCash >= selectValue) && (selectValue >= 0)) ? '' : '입력이 잘못되었어요!'}
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
              disabled={(!(chargeCash >= selectValue)) || !(selectValue >= 0)}
            >
              진행
            </Button>
          </div>
        </div>

        {/* 환불 신청 완료 시의 notification */}
        <Dialog
          open={ReturnCashSnack}
          keepMounted
          onClose={handleSnackClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AppBar color="primary" position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit">
                입력하신대로 환불 진행하시겠어요?
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
              {`환불 신청액 : ${selectValue}`}
            </Typography>
            <Typography className={classes.dialogContent} variant="h5" marked="center">
              {`환불 이후 잔여 출금 가능 금액 : ${chargeCash - selectValue}`}
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

ReturnCashModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  chargeCash: PropTypes.number.isRequired,
};

export default ReturnCashModal;
