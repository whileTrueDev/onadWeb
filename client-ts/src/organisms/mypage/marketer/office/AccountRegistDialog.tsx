import {
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useState } from 'react';
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import banks, { Bank } from '../../../../constants/banks';
import history from '../../../../history';
import { useMarketerUpdateAccountMutation } from '../../../../utils/hooks/mutation/useMarketerUpdateAccountMutation';

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
  },
  contentText: {
    marginTop: '8px',
    fontSize: 15,
    fontWeight: 700,
  },
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  textField: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 120,
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

const AccountDialog = (props: { open: boolean; handleDialogClose: () => void }): JSX.Element => {
  const { open, handleDialogClose } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // ****************************************************
  const [bank, setBank] = useState<Bank | null>(null);
  const handleChangeBank = (event: any, newValue: Bank | null): void => {
    setBank(newValue);
  };

  const updateAccountMutation = useMarketerUpdateAccountMutation();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const bankRealName = (document.getElementById('accountHolder') as HTMLInputElement).value;
    const idNumber = (document.getElementById('idNumber') as HTMLInputElement).value;
    const bankAccount = (document.getElementById('bankAccount') as HTMLInputElement).value;

    /** *******************
     * 계좌 조회 api 요청필요
     ******************* */
    if (!bank) return alert('은행을 선택해주세요!');

    return updateAccountMutation
      .mutateAsync({
        bankName: bank.bankName,
        bankRealName,
        idNumber,
        bankAccount,
      })
      .then(() => {
        handleDialogClose();
        history.push('/mypage/marketer/myoffice/cash');
        enqueueSnackbar('환불 계좌번호 저장에 성공하였습니다.', { variant: 'success' });
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar(
          '환불 계좌번호 저장에 실패하였습니다. 문제가 지속적으로 발견될 시, support@onad.io로 문의바랍니다.',
          { variant: 'error' },
        );
      });
  };

  const Content = (): JSX.Element => (
    <DialogContent className={classes.contents}>
      <DialogContentText className={classes.contentText}>
        환불 받을 계좌정보를 입력해주세요.
      </DialogContentText>

      <Autocomplete
        id="bank-name-box"
        options={banks}
        getOptionLabel={option => option.bankName}
        value={bank}
        onChange={handleChangeBank}
        renderInput={params => (
          <TextField
            {...params}
            required
            label="은행"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      />

      <TextField
        required
        label="예금주"
        margin="dense"
        className={classes.textField}
        id="accountHolder"
        type="text"
        inputProps={{
          maxLength: 17,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ width: '200px' }}
      />

      <TextField
        required
        label="주민번호 앞자리"
        id="idNumber"
        className={classes.textField}
        helperText="주민등록번호 앞 6자리를 입력해주세요."
        margin="normal"
        type="number"
        inputProps={{
          maxLength: 6,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        style={{
          maxWidth: 250,
          marginRight: 10,
        }}
      />

      <FormControl className={classes.textField}>
        <InputLabel shrink>계좌번호</InputLabel>
        <Input
          required
          id="bankAccount"
          type="number"
          inputProps={{
            required: true,
            maxLength: 16,
          }}
        />
        <FormHelperText>(-)을 제외한 계좌번호를 입력하세요</FormHelperText>
      </FormControl>
    </DialogContent>
  );

  return (
    <Dialog maxWidth="xl" title="환불 계좌 입력" open={open} onClose={handleDialogClose}>
      {/* <DialogTitle>환급 계좌 입력</DialogTitle> */}
      <form id="accountForm" onSubmit={handleSubmit}>
        <Content />

        <DialogActions>
          <Button type="submit" value="Submit" color="primary">
            확인
          </Button>
          <Button color="default" onClick={handleDialogClose}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountDialog;
