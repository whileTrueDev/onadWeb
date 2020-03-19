import React from 'react';
// core
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import Button from '../../../../../atoms/CustomButtons/Button';
import DashboardStyle from '../../../../../assets/jss/views/dashboardStyle';
import AccountRegistDialog from '../AccountRegistDialog';
import { accountInterface } from '../interface';
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
    marginBottom: 10
  },
  success: {
    color: theme.palette.primary.main
  }
}));

interface propInterface {
  classes: any;
  accountData: UseGetRequestObject<accountInterface | null>
}

function RefundAccountForm(props: propInterface) {
  const myClasses = useStyles();
  const { classes, accountData } = props;
  const { open, handleOpen, handleClose } = useDialog();
  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          환불 계좌 정보
        </h4>
      </CardHeader>
      {!accountData.loading && accountData.data && accountData.data.marketerAccountNumber ? (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="primary"
              onClick={() => { handleOpen() }}
              size="medium"
            >
              환불계좌 변경
            </Button>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">
              계좌번호 : {accountData.data.marketerAccountNumber}
            </Typography>
          </div>
          <div className={myClasses.textBox}>
            <Typography gutterBottom variant="body1">
              예금주 : {accountData.data.accountHolder}
            </Typography>
          </div>
        </CardBody>
      ) : (
          <CardBody>
            <div className={myClasses.buttonWrapper}>
              <Button
                color="primary"
                onClick={() => { handleOpen() }}
                size="medium"

              >
                환불계좌 등록
            </Button>
            </div>
            <div className={myClasses.textBox}>
              <Typography gutterBottom variant="body1">아직 등록된 환불계좌가 없습니다.</Typography>
            </div>
            <div className={myClasses.textBox}>
              <Typography gutterBottom variant="body1" className={classes.success}>등록</Typography>
              <Typography gutterBottom variant="body1">
                버튼을 눌러 환불계좌를 등록해주세요.
            </Typography>
            </div>


          </CardBody>
        )}

      <AccountRegistDialog open={open} handleDialogClose={handleClose} />


    </Card>
  );
}


export default withStyles(DashboardStyle)(RefundAccountForm);
