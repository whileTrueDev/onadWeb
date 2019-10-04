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
import axios from '../../../../utils/axios';
// customized component
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import HOST from '../../../../utils/config';
import history from '../../../../history';

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

function useConfirmDialog(handleClose) {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose() {
    setConfirmDialogOpen(false);
  }

  function handleConfirmDialogOpen() {
    setConfirmDialogOpen(true);
  }

  return {
    confirmDialogOpen, handleConfirmDialogClose, handleOnlyDialogClose, handleConfirmDialogOpen,
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
    open, handleClose, currentCash,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('100000');
  const chargeType = useValue('계좌이체');
  const totalDebit = Number(currentCash) + Number(selectValue);

  // 출금신청 스낵바
  const {
    confirmDialogOpen, handleConfirmDialogClose, handleOnlyDialogClose,
    handleConfirmDialogOpen,
  } = useConfirmDialog(handleClose);

  // 캐시 충전진행 버튼 클릭
  // function handleClick() {
  //   handleConfirmDialogOpen();
  // }

  function handleSubmitClick() {
    // 해당 금액 만큼 광고 캐시에 추가하는 요청
    axios.post(`${HOST}/api/dashboard/marketer/cash/charge`, {
      chargeCash: selectValue,
      chargeType: chargeType.selectValue
    }).then((res) => {
      if (!res[0]) {
        handleConfirmDialogClose();
        history.push('/dashboard/marketer/myoffice');
      } else {
        console.log('cash - charge - error!');
      }
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
            onClick={handleConfirmDialogOpen}
          >
            진행

          </Button>
          <Button onClick={handleClose}>취소</Button>
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
              {`${currentCash} 원`}
            </Typography>
          </div>
          <Divider />

          {/* 결제방법 선택 */}
          <div>
            <Typography variant="subtitle1" id="select-type" className={classes.contentTitle}>
            결제 방법
            </Typography>
            <RadioGroup
              name="type"
              className={classes.contentDetail}
              value={chargeType.selectValue}
              onChange={chargeType.handleChange}
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
                />
              </Tooltip>
            </div>
          </div>

        </div>

        {/* 캐시충전 신청 완료 시의 notification */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleOnlyDialogClose}
          title="입력하신대로 캐시 충전 진행하시겠어요?"
          buttons={(
            <div>
              <Button onClick={handleSubmitClick} color="info">
                진행
              </Button>
              <Button onClick={handleOnlyDialogClose}>
                취소
              </Button>
            </div>
          )}
        >
          <DialogContent>
            <Typography variant="h5" marked="center">
              {`광고캐시 충전 신청액 : ${selectValue}`}
            </Typography>
            <Typography variant="h5" marked="center">
              {`충전 이후 보유 광고캐시 : ${totalDebit}`}
            </Typography>
          </DialogContent>
        </Dialog>

      </div>
    </Dialog>
  );
}

CashDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CashDialog;
