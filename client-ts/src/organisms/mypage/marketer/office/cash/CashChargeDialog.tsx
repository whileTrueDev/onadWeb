import React from 'react';
// material ui core
import { makeStyles, Theme } from '@material-ui/core/styles';
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
import Button from '../../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import HOST from '../../../../../utils/config';
import history from '../../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  contentTitle: { fontWeight: 'bold', },
  contentDetail: { marginTop: theme.spacing(1), },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  account: { marginBottom: 5, fontWeight: 700, color: 'red' },
  typo: { fontWeight: 600, color: 'red' }
}));

function useConfirmDialog(handleClose: () => void): {
  confirmDialogOpen: boolean;
  handleConfirmDialogClose: () => void;
  handleOnlyDialogClose: () => void;
  handleConfirmDialogOpen: () => void;
} {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false);

  function handleConfirmDialogClose(): void {
    setConfirmDialogOpen(false);
    handleClose(); // 모달창까지 닫기
  }

  function handleOnlyDialogClose(): void {
    setConfirmDialogOpen(false);
  }

  function handleConfirmDialogOpen(): void {
    setConfirmDialogOpen(true);
  }

  return {
    confirmDialogOpen,
    handleConfirmDialogClose,
    handleOnlyDialogClose,
    handleConfirmDialogOpen,
  };
}

function useValue(defaultValue: number | string): {
  selectValue: string | number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const [selectValue, setValue] = React.useState<number | string>(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return { selectValue, handleChange };
}

interface CashDialogProps {
  open: boolean;
  handleClose: () => void;
  currentCash: string;
}

function CashDialog(props: CashDialogProps): JSX.Element {
  const classes = useStyles();
  const {
    open, handleClose, currentCash,
  } = props;
  // select value
  const { selectValue, handleChange } = useValue('10000');
  const chargeType = useValue('무통장입금');
  const currentCashNumber = currentCash.replace(',', '');
  const totalDebit = Number(currentCashNumber) + Number(selectValue);

  // 출금신청 스낵바
  const {
    confirmDialogOpen, handleConfirmDialogClose, handleOnlyDialogClose,
    handleConfirmDialogOpen,
  } = useConfirmDialog(handleClose);


  function handleSubmitClick(): void {
    // 해당 금액 만큼 광고 캐시에 추가하는 요청
    axios.post<boolean[]>(`${HOST}/marketer/cash/charge`, {
      chargeCash: selectValue,
      chargeType: chargeType.selectValue,
    }).then((res) => {
      if (res.data[0]) {
        handleConfirmDialogClose();
        history.push('/mypage/marketer/myoffice');
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
            color="primary"
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
              {/* <FormControlLabel
                value="신용카드"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" >
                    신용카드
                  </Typography>
                )}
              /> */}
              {/* <FormControlLabel
                value="계좌이체"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1" >
                    계좌이체
                  </Typography>
                )}
              /> */}
              <FormControlLabel
                value="무통장입금"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1">
                    무통장입금
                  </Typography>
                )}
              />
            </RadioGroup>
            <Typography variant="subtitle1" className={classes.account}>
              부산은행 : 101 - 2064 - 1964 - 03 (와일트루강동기)
            </Typography>

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
                value="50000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1">
                    50,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="100000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1">
                    100,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="300000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1">
                    300,000 원
                  </Typography>
                )}
              />
              <FormControlLabel
                value="500000"
                control={<Radio color="primary" />}
                label={(
                  <Typography variant="subtitle1">
                    500,000 원
                  </Typography>
                )}
              />
            </RadioGroup>
            <div style={{ position: 'absolute', top: 50, left: 200 }}>
              <Tooltip title="직접입력 하십시오.">
                <TextField
                  id="selectValue"
                  label={(
                    <Typography variant="subtitle1">
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
          title="입력하신대로 캐시 충전 하시겠어요?"
          buttons={(
            <div>
              <Button onClick={handleSubmitClick} color="primary">
                진행
              </Button>
              <Button onClick={handleOnlyDialogClose}>
                취소
              </Button>
            </div>
          )}
        >
          <DialogContent>
            <Typography variant="h6">
              {/* marked="center" */}
              {`광고캐시 충전 신청액 : ${selectValue}`}
            </Typography>
            <Typography variant="h6">
              {/* marked="center" */}
              {`충전 이후 보유 광고캐시 : ${totalDebit}`}
            </Typography>
            <Divider />
            <Typography variant="h6" style={{ marginTop: 10 }} className={classes.typo}>
              {`무통장 입금액 : ${(typeof selectValue === 'string') ? parseInt(selectValue, 10) * 1.1 : selectValue * 1.1}`}
              원(부가세포함)을
            </Typography>
            <Typography variant="h6" className={classes.typo}>
              부산은행 : 101 - 2064 - 1964 - 03 (와일트루강동기)
            </Typography>
            <Typography variant="h6" className={classes.typo}>
              회원가입시 이름(회사명) 명의로 입금해주십시오.
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
              입금 확인이 되면 캐시가 충전됩니다.
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
              세금계산서 발행은 화면 왼쪽의 사용방법에서 안내합니다.
            </Typography>
          </DialogContent>
        </Dialog>

      </div>
    </Dialog>
  );
}

export default CashDialog;
