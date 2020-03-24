import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, TextField } from '@material-ui/core';
import AccountNumberForm from './Account/AccountNumberForm';
import history from '../../../history';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    borderColor: `linear-gradient(60deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  },
}));

const AccountCard = (props) => {
  const classes = useStyles();
  const { profileData } = props;
  return (
    <CustomCard
      iconComponent={<StyledItemText primary="내 계좌 정보 변경" color="white" />}
    >
      <div style={{ textAlign: 'center' }}>
        <StyledItemText primary="내 계좌 정보" fontSize="18px" style={{ margin: '16px 0' }} />
      </div>

      {profileData.loading && (<CircularProgress small />)}
      {!profileData.loading && !profileData.error && (
        <Grid container direction="row" justify="center" spacing={2}>
          <Grid item sm={12} md={9}>
            <TextField
              label="현재 등록된 계좌"
              value={profileData.payload.result.creatorAccountNumber
                ? `${profileData.payload.result.creatorAccountNumber.split('_')}`
                : '현재 등록된 계좌가 존재하지 않습니다.'}
              margin="normal"
              className={classes.textField}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item sm={12} md={9}>
            <TextField
              label="현재 등록된 예금주"
              value={profileData.payload.result.realName
                ? `${profileData.payload.result.realName}`
                : '예금주가 존재하지 않습니다.'}
              margin="normal"
              className={classes.textField}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      )}

      <div style={{ textAlign: 'center' }}>
        <StyledItemText primary="계좌 재입력" fontSize="18px" style={{ margin: '16px 0' }} />
      </div>
      <AccountNumberForm history={history} />

    </CustomCard>
  );
};

export default AccountCard;
