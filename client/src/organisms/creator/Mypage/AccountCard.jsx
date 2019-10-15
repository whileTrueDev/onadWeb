import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Grid } from '@material-ui/core';
import axios from '../../../utils/axios';
// core components
import Card from '../../../atoms/Card/Card';
import CardAvatar from '../../../atoms/Card/CardAvatar';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import AccountNumberForm from '../IncomeManage/AccountNumberForm';
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
      iconComponent={<StyledItemText primary="계정 및 계좌 정보 변경" style={{ color: '#FFF' }} />}
    >
      {profileData.loading && (<CircularProgress small />)}
      {!profileData.loading && !profileData.error && (
        <Grid container direction="column" justify="center">
          <Grid container direction="column">
            <Grid item>
              <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
               현재 등록된 계좌
              </Typography>
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
          <Grid container direction="column">
            <Grid item>
              <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
                계좌 재입력
              </Typography>
            </Grid>
            <Grid item>
              <AccountNumberForm history={history} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </CustomCard>
  );
};

export default AccountCard;
