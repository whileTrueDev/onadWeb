import { useState } from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import Button from '../../../../atoms/button/customButton';
import SettlementForm from './settlement/settlementForm';
import SettlementContent from './settlement/settlementContent';
import StyledItemText from '../../../../atoms/styledItemText';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
import CenterLoading from '../../../../atoms/loading/centerLoading';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
    borderColor: `linear-gradient(60deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  },
  typeButton: {
    marginRight: 20,
  },
  titleWrap: {
    textAlign: 'center',
    height: 30,
    border: 'solid 1px #2771ff',
    margin: '10px 0',
    borderRadius: 5,
  },
  AgreementField: {
    width: '100%',
    margin: '20px 0',
    height: 80,
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'solid 1px #2771ff',
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.main,
    },
    marginLeft: 20,
  },
}));

const SettlementCard = (): JSX.Element => {
  const classes = useStyles();
  const profile = useCreatorProfile();
  let settlementState;
  switch (profile.data?.settlementState) {
    case 0:
      settlementState = '미등록';
      break;
    case 1:
      settlementState = '승인대기';
      break;
    case 2:
      settlementState = '승인완료';
      break;
    default:
      settlementState = '반려';
      break;
  }
  // 0일 경우 개인(대한민국국민), 1일경우 개인사업자
  const [CreatorType, setCreatorType] = useState(0);

  function handleClick(type: string): void {
    if (type === 'normal') {
      setCreatorType(0);
    } else {
      setCreatorType(1);
    }
  }

  if (profile.isLoading) return <CenterLoading />;
  if (!profile.data) return <div />;

  return (
    <Paper style={{ padding: 32, marginTop: 8 }}>
      <Typography style={{ fontWeight: 'bold' }} component="div">
        정산 등록 관리
        <Chip
          style={{ marginLeft: 8 }}
          label={settlementState}
          color={profile.data.settlementState === 2 ? 'primary' : 'default'}
        />
      </Typography>
      {(profile.data.settlementState === 0 || profile.data.settlementState === 3) && (
        <>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item sm={12}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산관리 설정" fontSize="18px" color="#2771ff" />
              </div>
            </Grid>
            <Grid item sm={12}>
              <div>
                <StyledItemText
                  primary="해당하는 유형을 선택해주세요."
                  fontSize="18px"
                  color="#2771ff"
                />
              </div>
              <Button
                className={classes.typeButton}
                color={CreatorType === 0 ? 'primary' : undefined}
                onClick={(): void => {
                  handleClick('normal');
                }}
              >
                개인(대한민국 국민)
              </Button>
              <Button
                className={classes.typeButton}
                color={CreatorType === 1 ? 'primary' : undefined}
                onClick={(): void => {
                  handleClick('bussiness');
                }}
              >
                개인사업자
              </Button>
            </Grid>
            <Grid item sm={12}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산등록 신청서" fontSize="18px" color="#2771ff" />
              </div>
            </Grid>
            <Grid item sm={12}>
              <SettlementForm CreatorType={CreatorType} />
            </Grid>
          </Grid>
        </>
      )}
      {profile.data.settlementState === 1 && (
        <>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item sm={12}>
              <div className={classes.titleWrap}>
                <StyledItemText
                  primary="정산등록 신청 승인대기 중입니다."
                  fontSize="18px"
                  color="#2771ff"
                />
              </div>
            </Grid>
          </Grid>
        </>
      )}
      {profile.data.settlementState === 2 && (
        <>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item sm={12}>
              <SettlementContent
                name={profile.data.name}
                phoneNumber={profile.data.phoneNumber}
                identificationNumber={profile.data.identificationNumber}
                creatorType={profile.data.creatorType}
                identificationImg={profile.data.identificationImg}
                AccountImg={profile.data.AccountImg}
                BussinessRegiImg={profile.data.BussinessRegiImg}
                realName={profile.data.realName}
                creatorAccountNumber={profile.data.creatorAccountNumber}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default SettlementCard;
