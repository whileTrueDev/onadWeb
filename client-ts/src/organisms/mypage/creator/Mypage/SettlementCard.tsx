import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, TextField } from '@material-ui/core';
import Button from '../../../../atoms/CustomButtons/Button';
import SettlementForm from './Settlement/SettlementForm';
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
  }
}));

interface SettlementCardProps {
  profileData: ProfileDataType;
  doProfileDataRequest: () => void;
  handleSnackOpen: () => void;
}
const SettlementCard = ({
  profileData,
  doProfileDataRequest,
  handleSnackOpen
}: SettlementCardProps): JSX.Element => {
  const classes = useStyles();
  const settlementState = '미등록';
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
      {profileData.creatorAccountNumber && (
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
              <Button className={classes.typeButton} color={CreatorType === 0 ? 'primary' : undefined} onClick={() => { handleClick('normal'); }}>개인(대한민국 국민)</Button>
              <Button className={classes.typeButton} color={CreatorType === 1 ? 'primary' : undefined} onClick={() => { handleClick('bussiness'); }}>개인사업자</Button>
            </Grid>
            {/* <Grid item sm={12} md={9}>
              <TextField
                label="현재 등록된 계좌"
                value={profileData.creatorAccountNumber
                  ? `${profileData.creatorAccountNumber.split('_')}`
                  : '현재 등록된 계좌가 존재하지 않습니다.'}
                margin="normal"
                className={classes.textField}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item sm={12} md={9}>
              <TextField
                label="현재 등록된 예금주"
                value={profileData.realName
                  ? `${profileData.realName}`
                  : '예금주가 존재하지 않습니다.'}
                margin="normal"
                className={classes.textField}
                InputProps={{ readOnly: true }}
              />
            </Grid> */}
            <Grid item sm={12} md={9}>
              <div className={classes.titleWrap}>
                <StyledItemText primary="정산등록 신청서" fontSize="18px" color="#00acc1" />
              </div>
            </Grid>
            <Grid item sm={12} md={9}>
              <SettlementForm
                doProfileDataRequest={doProfileDataRequest}
                handleSnackOpen={handleSnackOpen}
              />
            </Grid>
          </Grid>
        </>
      )}
    </CustomCard>
  );
};

export default SettlementCard;
