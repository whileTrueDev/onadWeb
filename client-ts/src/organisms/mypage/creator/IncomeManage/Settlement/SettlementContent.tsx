// AccountNumber를 입력하는 Form component 작성
import { TextField, Grid, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { nanoid } from 'nanoid';
import Button from '../../../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../../../atoms/StyledItemText';
import { ProfileDataType } from '../../Mypage/ProfileData.type';
import useDialog from '../../../../../utils/hooks/useDialog';
import SettlementForm from './SettlementForm';
import AgreementSource from '../source/source';

const useStyles = makeStyles(() => ({
  textField: {
    width: '80%',
    margin: '4px 0px 8px 0px',
  },
  titleWrap: {
    margin: '20px 0',
  },
  contentTitle: {
    width: '20%',
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentImageWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0',
  },
  contentImage: {
    width: '50%',
    margin: '0 auto',
  },
  AgreementField: {
    width: '100%',
    margin: '20px 0',
    height: 80,
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'solid 1px #2771ff',
  },
  textFieldContent: {
    width: '100%',
    margin: '20px 0',
    height: 150,
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'solid 1px #2771ff',
  },
}));

interface SettlementContentProps {
  profileData: ProfileDataType;
}

function SettlementContent({ profileData }: SettlementContentProps): JSX.Element {
  const classes = useStyles();
  const {
    name,
    phoneNumber,
    identificationNumber,
    creatorType,
    identificationImg,
    AccountImg,
    BussinessRegiImg,
    realName,
    creatorAccountNumber,
  } = profileData;
  const ImageUploadID = useDialog();
  const ImageUploadAC = useDialog();
  const BussinessUpload = useDialog();
  const settlementUpdate = useDialog();

  return (
    <>
      <div>
        <StyledItemText
          className={classes.titleWrap}
          primary="정산 수수료 및 절차, 종합소득세 신고 안내 📋"
          fontSize="18px"
          color="#2771ff"
        />
      </div>
      <Grid item className={classes.textFieldContent}>
        {AgreementSource.taxGuidance.split('\n').map((sentence: string) => (
          <p key={nanoid()}>{sentence}</p>
        ))}
      </Grid>
      {creatorType === 1 && (
        <div>
          <Grid item className={classes.AgreementField}>
            <p>
              개인사업자 계약 진행시 세무대리인 혹은 본인이 직접 홈택스를 통해 모든 세무 신고를
              진행하여야하며 신고 누락, 금액 오기재 등으로 피해가 발생하여도 온애드는 일절 책임이
              없음을 알립니다.
            </p>
          </Grid>
        </div>
      )}
      <div>
        <StyledItemText
          className={classes.titleWrap}
          primary="계약자 정보 📋"
          fontSize="18px"
          color="#2771ff"
        />
      </div>
      <Grid item className={classes.content}>
        <StyledItemText primary="과세 유형" fontSize="15px" className={classes.contentTitle} />
        {creatorType === 0 ? (
          <StyledItemText primary="개인(사업소득)" fontSize="15px" className={classes.textField} />
        ) : (
          <StyledItemText primary="개인사업자" fontSize="15px" className={classes.textField} />
        )}
      </Grid>
      <Grid item className={classes.content}>
        <StyledItemText primary="성명" fontSize="15px" className={classes.contentTitle} />
        <TextField
          value={name}
          InputProps={{ readOnly: true }}
          className={classes.textField}
          margin="dense"
          name="creatorName"
        />
      </Grid>
      <Grid item className={classes.content}>
        <StyledItemText primary="주민등록번호" fontSize="15px" className={classes.contentTitle} />
        <TextField
          value={`${identificationNumber.slice(0, 6)} - ⚫⚫⚫⚫⚫⚫⚫`}
          InputProps={{ readOnly: true }}
          className={classes.textField}
          margin="dense"
        />
      </Grid>
      <Grid item className={classes.content}>
        <StyledItemText primary="휴대전화번호" fontSize="15px" className={classes.contentTitle} />
        <TextField
          value={`${phoneNumber.slice(0, 3)} - ⚫⚫⚫⚫ - ${phoneNumber.slice(7, 11)}`}
          InputProps={{ readOnly: true }}
          className={classes.textField}
          margin="dense"
        />
      </Grid>
      <div>
        <StyledItemText
          className={classes.titleWrap}
          primary="정산 계좌 정보 📋"
          fontSize="18px"
          color="#2771ff"
        />
      </div>
      <Grid item className={classes.content}>
        <StyledItemText primary="예금주" fontSize="15px" className={classes.contentTitle} />
        <TextField
          value={realName}
          InputProps={{ readOnly: true }}
          className={classes.textField}
          margin="dense"
          name="userName"
        />
      </Grid>
      <Grid item className={classes.content}>
        <StyledItemText primary="계좌번호" fontSize="15px" className={classes.contentTitle} />
        <TextField
          value={creatorAccountNumber}
          InputProps={{ readOnly: true }}
          margin="dense"
          className={classes.textField}
        />
      </Grid>
      <div>
        <StyledItemText
          className={classes.titleWrap}
          primary="파일업로드 📋"
          fontSize="18px"
          color="#2771ff"
        />
      </div>
      <Grid item className={classes.contentImageWrap}>
        <StyledItemText primary="신분증" fontSize="15px" className={classes.contentTitle} />
        <Button onClick={ImageUploadID.handleOpen}>신분증확인</Button>
      </Grid>
      <Grid item className={classes.contentImageWrap}>
        <StyledItemText primary="통장사본" fontSize="15px" className={classes.contentTitle} />
        <Button onClick={ImageUploadAC.handleOpen}>통장사본확인</Button>
      </Grid>
      {creatorType === 1 && (
        <Grid item className={classes.contentImageWrap}>
          <StyledItemText primary="사업자등록증" fontSize="15px" className={classes.contentTitle} />
          <Button onClick={BussinessUpload.handleOpen}>사업자등록증확인</Button>
        </Grid>
      )}
      <Grid item>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={settlementUpdate.handleOpen} color="primary">
            변경
          </Button>
        </div>
      </Grid>
      <Dialog open={Boolean(ImageUploadID.open)} onClose={ImageUploadID.handleClose} maxWidth="md">
        <img src={identificationImg} alt="신분증" className={classes.contentImage} />
      </Dialog>
      <Dialog open={Boolean(ImageUploadAC.open)} onClose={ImageUploadAC.handleClose} maxWidth="md">
        <img src={AccountImg} alt="통장사본" className={classes.contentImage} />
      </Dialog>
      <Dialog
        open={Boolean(BussinessUpload.open)}
        onClose={BussinessUpload.handleClose}
        maxWidth="md"
      >
        <img src={BussinessRegiImg} alt="사업자등록증" className={classes.contentImage} />
      </Dialog>
      <Dialog
        open={Boolean(settlementUpdate.open)}
        onClose={settlementUpdate.handleClose}
        fullWidth
        maxWidth="md"
      >
        <div style={{ width: '95%', margin: '0 auto' }}>
          <SettlementForm CreatorType={creatorType} />
        </div>
      </Dialog>
    </>
  );
}

export default SettlementContent;
