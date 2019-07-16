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
  contentTitle: {
    fontWeight: 'bold',
  },
  contentDetail: {
    marginTop: theme.spacing(1),
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
}));

function useCashSnack(handleClose) {
  const [cashSnack, setcashSnack] = React.useState(false);

  function handleSnackClose() {
    setcashSnack(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose() {
    setcashSnack(false);
  }

  function handleSnackOpen() {
    setcashSnack(true);
  }

  return {
    cashSnack, handleSnackClose, handleOnlyDialogClose, handleSnackOpen,
  };
}

function useValue(defaultValue) {
  const [selectValue, setValue] = React.useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { selectValue, handleChange };
}

function CashDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, chargeCash, history,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('100000');

  const totaldebit = Number(chargeCash) + Number(selectValue);

  // 출금신청 스낵바
  const {
    cashSnack, handleSnackClose, handleOnlyDialogClose,
    // handleSnackOpen,
  } = useCashSnack(handleClose);

  // 캐시 충전진행 버튼 클릭
  // function handleClick() {
  //   handleSnackOpen();
  // }

  function handleSubmitClick() {
    // 해당 금액 만큼 광고 캐시에 추가하는 요청
    axios.post(`${HOST}/api/dashboard/marketer/chargecash`, {
      chargecash: selectValue,
    }).then((res) => {
      handleSnackClose();
      history.push('/dashboard/marketer/cash');
    }).catch((err) => {
      console.log(err);
    });
  }


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      title="광고캐시 충전"
      buttons={(
        <div>
          <Button
            color="info"
            // onClick={handleClick}
          >
              진행
          </Button>
          <Button>
              취소
          </Button>
        </div>
)}
    >
      <div>
        <div>
          {/* 보유한 광고캐시 금액 */}
          <div>
            <Typography className={classes.contentTitle} variant="subtitle1">
            보유한 광고캐시 금액
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

          {/* 결제방법 선택 */}
          <div>
            <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
            결제 방법
            </Typography>
            <RadioGroup
              name="howmuch"
              className={classes.contentDetail}
            >
              <FormControlLabel
                value="신용카드"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    신용카드
                  </Typography>
                )}
              />
              <FormControlLabel
                value="계좌이체"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    계좌이체
                  </Typography>
                )}
              />
              <FormControlLabel
                value="무통장입금"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    무통장입금
                  </Typography>
                )}
              />
            </RadioGroup>
          </div>
          <Divider />

          {/* 충전금액입력 */}
          <div style={{ position: 'relative', width: 150 }}>
            <Typography className={classes.contentTitle} variant="subtitle1">
              광고캐시 충전 금액
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
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    100,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="500000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    500,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="1000000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    1,000,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="5000000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    5,000,000 원
                  </Typography>
                )}
              />
            </RadioGroup>
            <div style={{ position: 'absolute', top: 50, left: 200 }}>
              <Tooltip title="직접입력 하십시오.">
                <TextField
                  id="selectValue"
                  label={(
                    <Typography variant="subtitle1" className={classes.selectValue}>
                    충전할 금액을 입력하세요
                    </Typography>
                  )}
                  type="number"
                  className={classes.textField}
                  value={selectValue}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  // helperText={((chargeCash >= selectValue)
                  // && (selectValue >= 0)) ? '' : '입력이 잘못되었어요!'}
                />
              </Tooltip>
            </div>
          </div>

        </div>

        {/* 캐시충전 신청 완료 시의 notification */}
        <Dialog
          open={cashSnack}
          onClose={handleOnlyDialogClose}
          title="입력하신대로 캐시 충전 진행하시겠어요?"
          buttons={(
            <div>
              <Button onClick={handleOnlyDialogClose}>
              취소
              </Button>
              <Button onClick={handleSubmitClick} color="info">
              진행
              </Button>
            </div>
          )}
        >
          <DialogContent>
            <Typography variant="h5" marked="center">
              {`광고캐시 충전 신청액 : ${selectValue}`}
            </Typography>
            <Typography variant="h5" marked="center">
              {`충전 이후 보유 광고캐시 : ${totaldebit}`}
            </Typography>
          </DialogContent>
          <DialogContent>
            <Warning>
              <Typography variant="subtitle1" marked="center">
                {'추후 도입기능 입니다'}
              </Typography>
            </Warning>
          </DialogContent>
        </Dialog>

      </div>
    </Dialog>
  );
}

CashDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  chargeCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CashDialog;
