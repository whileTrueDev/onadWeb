import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Button from '../../../../atoms/CustomButtons/Button';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import AccountRegistDialog from './AccountRegistDialog';
// hooks
import useDialog from '../../../../utils/lib/hooks/useDialog';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

function RefundAccountForm(props) {
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
      { !accountData.loading && accountData.payload.accountNumber ? (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
              onClick={handleOpen}
            >
            환불계좌 변경
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1">
              계좌번호 : {accountData.payload.accountNumber}
            </Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1">
              예금주 : {accountData.payload.accountHolder}
            </Typography>
          </div>
        </CardBody>
      ) : (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
              onClick={handleOpen}
            >
            환불계좌 등록
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 5 }}>
            <Typography gutterBottom variant="body1">아직 등록된 환불계좌가 없습니다.</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1" style={{ color: '#00acc1' }}>등록</Typography>
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

RefundAccountForm.propTypes = {
  classes: PropTypes.object.isRequired,
  accountData: PropTypes.object
};

RefundAccountForm.defaultProps = {
  accountData: { payload: { accoundNumber: null }, loading: true, error: '' }
};

export default withStyles(DashboardStyle)(RefundAccountForm);
