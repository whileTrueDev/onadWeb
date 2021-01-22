import React from 'react';
// core
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// own components
import { Paper } from '@material-ui/core';
import Button from '../../../../../atoms/CustomButtons/Button';
import AccountRegistDialog from '../AccountRegistDialog';
import { AccountInterface } from '../interface';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

// hooks
import useDialog from '../../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: { color: theme.palette.primary.main }
}));

interface RefundAccountFormProps {
  accountData: UseGetRequestObject<AccountInterface | null>;
}

function RefundAccountForm(props: RefundAccountFormProps): JSX.Element {
  const myClasses = useStyles();
  const { accountData } = props;
  const { open, handleOpen, handleClose } = useDialog();
  return (
    <Paper style={{ padding: 32, marginTop: 8 }}>
      <Typography style={{ fontWeight: 'bold' }}>
          환불 계좌 정보
      </Typography>
      {!accountData.loading && accountData.data && accountData.data.marketerAccountNumber ? (
        <div>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="primary"
              onClick={(): void => { handleOpen(); }}
            >
              환불계좌 변경
            </Button>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">
              계좌번호 :
              {' '}
              {accountData.data.marketerAccountNumber}
            </Typography>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">
              예금주 :
              {' '}
              {accountData.data.accountHolder}
            </Typography>
          </div>
        </div>
      ) : (
        <div>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="primary"
              onClick={(): void => { handleOpen(); }}
              size="medium"
            >
              환불계좌 등록
            </Button>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">아직 등록된 환불계좌가 없습니다.</Typography>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">등록</Typography>
            <Typography gutterBottom variant="body1">
              버튼을 눌러 환불계좌를 등록해주세요.
            </Typography>
          </div>


        </div>
      )}

      <AccountRegistDialog open={open} handleDialogClose={handleClose} />


    </Paper>
  );
}


export default RefundAccountForm;
