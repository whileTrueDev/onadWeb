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
import axios from '../../../../../../utils/axios';
// customized component
import Dialog from '../../../../components/Dialog/Dialog';
import Button from '../../../../components/CustomButtons/Button';
import Warning from '../../../../components/Typography/Warning';
import HOST from '../../../../../../config';
import history from '../../../../../../history';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontWeight: 'bold',
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

function useRefundConfirmDialog(handleClose) {
  const [RefundConfirmDialog, setRefundConfirmDialog] = React.useState(false);

  function handleDialogClose() {
    setRefundConfirmDialog(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyConfirmDialogClose() {
    setRefundConfirmDialog(false);
  }

  function handleConfirmDialogOpen() {
    setRefundConfirmDialog(true);
  }

  return {
    RefundConfirmDialog,
    handleDialogClose,
    handleOnlyConfirmDialogClose,
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

function RefundDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, accountNumber, currentCash,
  } = props;

  // select value
  const { selectValue, handleChange } = useValue('0');

  // 캐쉬 환불신청 스낵바
  const {
    RefundConfirmDialog, handleDialogClose, handleOnlyConfirmDialogClose,
    handleConfirmDialogOpen,
  } = useRefundConfirmDialog(handleClose);

  function handleSubmitClick() {
    if (currentCash - selectValue < 0) {
      alert('불가합니다');
    } else {
      // 해당 금액 만큼 환불 내역에 추가하는 요청
      axios.post(`${HOST}/api/dashboard/marketer/cash/refund`, {
        withdrawCash: selectValue,
      }).then((res) => {
        handleDialogClose();
        history.push('/dashboard/marketer/myoffice');
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="광고캐시 환불"
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="info"
            onClick={!(!(currentCash >= selectValue)) || !(selectValue > 0)
              ? handleConfirmDialogOpen
              : null}
            disabled={(!(currentCash >= selectValue)) || !(selectValue > 0)}
          >
                진행
          </Button>
          <Button onClick={handleClose}>
              취소
          </Button>
        </div>
      )}
    >
      <div>
        {/* 모달내용 */}
        {/* 보유한 광고캐시 금액 */}
        <div>
          <Typography variant="subtitle1" className={classes.contentTitle}>
            환불 계좌
          </Typography>
          <Typography variant="h5">
            {`${accountNumber.split('_')[0]}   ${accountNumber.split('_')[1]}`}
          </Typography>
        </div>
        <Divider />

        {/* 출금가능금액 */}
        <div>
          <Typography variant="subtitle1" className={classes.contentTitle}>
            환불 가능 금액
          </Typography>
          <Typography variant="h4">
            {`${currentCash} 원`}
          </Typography>
        </div>
        <Divider />

        {/* 출금금액입력 */}
        <div style={{ position: 'relative', width: 150 }}>
          <Typography variant="subtitle1" className={classes.contentTitle}>
              광고캐시 환불 금액
          </Typography>
          <RadioGroup
            name="howmuch"
            value={selectValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="100000"
              control={<Radio color="primary" />}
              label={
                  currentCash > 100000
                    ? (
                      <Typography variant="subtitle1" className={classes.selectValue}>
                    100,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="subtitle1">
                    100,000 원
                      </Typography>
                    )
                  }
              disabled={!(currentCash > 100000)}
            />
            <FormControlLabel
              value="500000"
              control={<Radio color="primary" />}
              label={
                  currentCash > 500000
                    ? (
                      <Typography variant="subtitle1" className={classes.selectValue}>
                    500,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="subtitle1">
                    500,000 원
                      </Typography>
                    )
                }
              disabled={!(currentCash > 500000)}
            />
            <FormControlLabel
              value="1000000"
              control={<Radio color="primary" />}
              label={
                  currentCash > 1000000
                    ? (
                      <Typography variant="subtitle1" className={classes.selectValue}>
                    1,000,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="subtitle1">
                    1,000,000 원
                      </Typography>
                    )
                }
              disabled={!(currentCash > 1000000)}
            />
            <FormControlLabel
              value="5000000"
              control={<Radio color="primary" />}
              label={
                  currentCash > 5000000
                    ? (
                      <Typography variant="subtitle1" className={classes.selectValue}>
                    5,000,000 원
                      </Typography>
                    )
                    : (
                      <Typography variant="subtitle1">
                    5,000,000 원
                      </Typography>
                    )
                }
              disabled={!(currentCash > 5000000)}
            />
          </RadioGroup>
          <div style={{ position: 'absolute', top: 50, left: 200 }}>
            <Tooltip title="직접입력 하십시오.">
              <TextField
                id="selectValue"
                label={(
                  <Typography variant="subtitle1" className={classes.selectValue}>
                    환불할 금액을 입력하세요
                  </Typography>
                  )}
                type="number"
                className={classes.textField}
                value={selectValue}
                onChange={handleChange}
                margin="normal"
                error={(!(currentCash >= selectValue)) || !(selectValue >= 0)}
                variant="outlined"
                helperText={((currentCash >= selectValue) && (selectValue >= 0)) ? null : '입력이 잘못되었어요!'}
              />
            </Tooltip>
          </div>
        </div>

        {/* 환불 신청 완료 시의 notification */}
        <Dialog
          open={RefundConfirmDialog}
          onClose={handleOnlyConfirmDialogClose}
          title="입력하신대로 환불 진행하시겠어요?"
          buttons={(
            <div>
              <Button onClick={handleSubmitClick} color="info">
              진행
              </Button>
              <Button onClick={handleOnlyConfirmDialogClose}>
              취소
              </Button>
            </div>
          )}
        >
          <DialogContent>
            <Typography variant="h5" marked="center">
              {`환불 신청액 : ${selectValue}`}
            </Typography>
            <Typography variant="h5" marked="center">
              {`환불 이후 잔여 출금 가능 금액 : ${currentCash - selectValue}`}
            </Typography>
            <Warning>
              <Typography variant="subtitle1" marked="center">
                {'환불까지 하루 또는 이틀이 소요되어요!!'}
              </Typography>
            </Warning>
          </DialogContent>
        </Dialog>
      </div>
    </Dialog>
  );
}

RefundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired,
  currentCash: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default RefundDialog;
