import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import Button from '../../../../atoms/CustomButtons/Button';
import SettlementForm from './Settlement/SettlementForm';
import SettlementContent from './Settlement/SettlementContent';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import { ProfileDataType } from './ProfileData.type';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    borderColor: `linear-gradient(60deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  },
  typeButton: {
    marginRight: 20
  },
  titleWrap: {
    textAlign: 'center',
    height: 30,
    border: 'solid 1px #00acc1',
    margin: '10px 0',
    borderRadius: 5
  },
  AgreementField: {
    width: '100%',
    margin: '20px 0',
    height: 80,
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'solid 1px #00acc1'
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.main,
    },
    marginLeft: 20
  },
}));

interface SettlementCardProps {
  profileData: ProfileDataType;
}
const SettlementCard = ({
  profileData,
}: SettlementCardProps): JSX.Element => {
  const classes = useStyles();
  let settlementState;
  switch (profileData.settlementState) {
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
  const [CreatorType, setCreatorType] = React.useState(0);

  function handleClick(type: string): void {
    if (type === 'normal') {
      setCreatorType(0);
    } else {
      setCreatorType(1);
    }
  }

  return (
    <CustomCard
      iconComponent={<StyledItemText primary="정산 관리" color="white" />}
      secondComponent={<StyledItemText primary={`${settlementState}`} color="#00acc1" />}
    >
      {(profileData.settlementState === 0 || profileData.settlementState === 3) && (
        <>
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item sm={12} md={9}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산관리 설정" fontSize="18px" color="#00acc1" />
              </div>
            </Grid>
            <Grid item sm={12} md={9}>
              <div>
                <StyledItemText primary="해당하는 유형을 선택해주세요." fontSize="18px" color="#00acc1" />
              </div>
              <Button className={classes.typeButton} color={CreatorType === 0 ? 'primary' : undefined} onClick={(): void => { handleClick('normal'); }}>개인(대한민국 국민)</Button>
              <Button className={classes.typeButton} color={CreatorType === 1 ? 'primary' : undefined} onClick={(): void => { handleClick('bussiness'); }}>개인사업자</Button>
            </Grid>
            <Grid item sm={12} md={9}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산등록 신청서" fontSize="18px" color="#00acc1" />
              </div>
            </Grid>
            <Grid item sm={12} md={9}>
              <SettlementForm
                CreatorType={CreatorType}
              />
            </Grid>
          </Grid>
        </>
      )}
      {(profileData.settlementState === 1) && (
        <>
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item sm={12} md={9}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산등록 신청 승인대기 중입니다." fontSize="18px" color="#00acc1" />
              </div>
            </Grid>
          </Grid>
        </>
      )}
      {(profileData.settlementState === 2) && (
        <>
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item sm={12} md={9}>
              <SettlementContent
                profileData={profileData}
              />
            </Grid>
          </Grid>
        </>
      )}
    </CustomCard>
  );
};

export default SettlementCard;
