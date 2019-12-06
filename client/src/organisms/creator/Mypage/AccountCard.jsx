import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Grid, Paper } from '@material-ui/core';
import AccountNumberForm from './Account/AccountNumberForm';
import history from '../../../history';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

const useStyles = makeStyles(theme => ({
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  dialogTitle: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    marginBottom: '3px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  contentWrapper: {
    margin: '20px 0px 20px 0px',
  },
  contentDetail: {
    marginTop: '5px',
    marginLeft: '20px',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    fontWeight: 900,
  },
  textField: {
    width: '100%',
    borderColor: 'linear-gradient(60deg, #00acc1, #26c6da)',
  },
  contentTitle: {
    marginBottom: '3px',
  }
}));

const AccountCard = (props) => {
  const classes = useStyles();
  const { profileData } = props;
  return (
    <CustomCard
      iconComponent={<StyledItemText primary="내 계좌 정보 변경" style={{ color: '#FFF' }} />}
    >
      {profileData.loading && (<CircularProgress small />)}
      {!profileData.loading && !profileData.error && (
        <Grid container direction="column" justify="center" spacing={3}>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <StyledItemText primary="현재 등록된 계좌" fontSize="18px" />
              </Grid>
              <Grid item>
                <Typography
                  id="select-account"
                  className={classes.contentDetail}
                >
                  {profileData.payload.result.creatorAccountNumber ? `${profileData.payload.result.creatorAccountNumber.split('_')[0]}   ${profileData.payload.result.creatorAccountNumber.split('_')[1]}` : '현재 등록된 계좌가 존재하지 않습니다.'}
                </Typography>
                <Divider style={{ marginBottom: '15px' }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <StyledItemText primary="계좌 재입력" fontSize="18px" />
              </Grid>
              <Grid item>
                <AccountNumberForm history={history} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </CustomCard>
  );
};

export default AccountCard;
