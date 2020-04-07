// AccountNumber를 입력하는 Form component 작성
import React, { useState, useReducer } from 'react';
import {
  TextField, MenuItem, Grid, Input, Dialog
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Button from '../../../../../atoms/CustomButtons/Button';
import banks from './banks';
import settlementFormReducer from './Settlement.reducer';
import usePostRequest from '../../../../../utils/hooks/usePostRequest';
import StyledItemText from '../../../../../atoms/StyledItemText';
import useImageUpload, { ImageData, UploadImage } from '../../../../../utils/hooks/useImageUpload';
import useDialog from '../../../../../utils/hooks/useDialog';
import SettlementAgreement from './SettlementAgreement';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: '80%',
    margin: '4px 0px 8px 0px'
  },
  titleWrap: {
    margin: '20px 0'
  },
  contentTitle: {
    width: '20%',
    margin: 0
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
    margin: '20px 0'
  },
  contentImage: {
    width: '50%'
  },
  titleWraper: {
    textAlign: 'center',
    height: 30,
    border: 'solid 1px #00acc1',
    margin: '30px 0',
    borderRadius: 5
  }
}));
interface SettlementFormProps {
  doProfileDataRequest: () => void;
  handleSnackOpen: () => void;
}
function SettlementForm({
  doProfileDataRequest, handleSnackOpen
}: SettlementFormProps): JSX.Element {
  const classes = useStyles();
  const ImageUploadIdentity = useDialog();
  const ImageUploadAccount = useDialog();
  // 은행
  const [bankState, dispatch] = useReducer(settlementFormReducer, { name: '농협', code: '011' });
  const handleChangeBank = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newbank = event.target.value;
    dispatch({ type: 'set', name: newbank });
  };

  // 계좌번호
  const [accountNum, setAccountNum] = useState<string>();
  const handleAccountChange = (values: NumberFormatValues): void => {
    setAccountNum(values.value);
  };

  // 예금주
  const [realName, setRealName] = useState('');
  const handleRealNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRealName(event.target.value);
  };

  // 크리에이터 성명
  const [creatorName, setCreatorName] = useState('');
  const handleCreatorNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCreatorName(event.target.value);
  };

  // 크리에이터 주민등록번호
  const [creatorIdentity, setCreatorIdentity] = useState();
  const [checkIdentity, setCheckIdentity] = useState(false);
  const handleCreatorIdentityChange = (values: NumberFormatValues): void => {
    setCreatorIdentity(values.value);
    const regx = /^[0-9]{13}/;
    if (regx.test(values.value)) {
      setCheckIdentity(false);
    } else {
      setCheckIdentity(true);
    }
  };

  // 크리에이터 휴대전화번호
  const [creatorPhone, setCreatorPhone] = useState();
  const handleCreatorPhone = (values: NumberFormatValues): void => {
    setCreatorPhone(values.value);
  };

  // 통장사본 및 신분증 사본 업로드 훅
  // const {
  //   imageUrl, readImage, handleImageChange
  // } = useImageUpload();

  // 이용약관 올체크
  const [allCheck, setAllCheck] = useState({
    checkA: false,
    checkB: false,
    checkC: false
  });

  // 출금 계좌 등록을 위한 요청 객체 생성
  const AccountPost = usePostRequest('/creator/account', () => {
    doProfileDataRequest();
    handleSnackOpen();
  });

  const handleSubmit = (event: React.MouseEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const userAccount = {
      bankName: bankState.name,
      bankRealName: realName,
      bankAccount: accountNum,
    };

    // usePostRequest
    AccountPost.doPostRequest({ ...userAccount });
  };

  return (
    <>
      <form id="accountForm" onSubmit={handleSubmit}>
        <div>
          <StyledItemText className={classes.titleWrap} primary="계약자 정보 📋" fontSize="18px" color="#00acc1" />
        </div>
        <Grid item className={classes.content}>
          <StyledItemText primary="과세 유형" fontSize="15px" className={classes.contentTitle} />
          <StyledItemText primary="개인(사업소득)" fontSize="15px" className={classes.textField} />
        </Grid>
        <Grid item className={classes.content}>
          <StyledItemText primary="성명" fontSize="15px" className={classes.contentTitle} />
          <TextField
            required
            value={creatorName}
            onChange={handleCreatorNameChange}
            className={classes.textField}
            margin="dense"
            name="creatorName"
            helperText="크리에이터님의 실명을 입력해주세요"
          />
        </Grid>
        <Grid item className={classes.content}>
          <StyledItemText primary="주민등록번호" fontSize="15px" className={classes.contentTitle} />
          <NumberFormat
            required
            helperText="주민등록번호 13자리를 입력해주세요"
            value={creatorIdentity}
            onValueChange={handleCreatorIdentityChange}
            format="###### - #######"
            mask="_"
            customInput={TextField}
            className={classes.textField}
            margin="dense"
            allowNegative={false}
            allowLeadingZeros
            error={checkIdentity}
          />
        </Grid>
        <Grid item className={classes.content}>
          <StyledItemText primary="휴대전화번호" fontSize="15px" className={classes.contentTitle} />
          <NumberFormat
            required
            helperText="(-)을 제외하고 입력하세요"
            value={creatorPhone}
            onValueChange={handleCreatorPhone}
            allowEmptyFormatting
            format="( ### ) - #### - ####"
            customInput={TextField}
            className={classes.textField}
            margin="dense"
            allowNegative={false}
            allowLeadingZeros
          />
        </Grid>
        <div>
          <StyledItemText className={classes.titleWrap} primary="정산 계좌 정보 📋" fontSize="18px" color="#00acc1" />
        </div>
        <Grid item className={classes.content}>
          <StyledItemText primary="은행" fontSize="15px" className={classes.contentTitle} />
          <TextField
            required
            select
            name="bank"
            id="bank"
            className={classes.textField}
            value={bankState.name || ''}
            onChange={handleChangeBank}
            margin="dense"
          >
            {banks.map((row) => {
              const name = row.bankName;
              return <MenuItem key={name} value={name}>{name}</MenuItem>;
            })}
          </TextField>
        </Grid>
        <Grid item className={classes.content}>
          <StyledItemText primary="예금주" fontSize="15px" className={classes.contentTitle} />
          <TextField
            required
            value={realName}
            onChange={handleRealNameChange}
            className={classes.textField}
            margin="dense"
            name="userName"
            helperText="해당 계좌의 예금주를 입력해주세요."
          />
        </Grid>
        <Grid item className={classes.content}>
          <StyledItemText primary="계좌번호" fontSize="15px" className={classes.contentTitle} />
          <NumberFormat
            required
            helperText="(-)을 제외하고 입력하세요"
            value={accountNum}
            onValueChange={handleAccountChange}
            customInput={TextField}
            margin="dense"
            className={classes.textField}
            allowNegative={false}
            allowLeadingZeros
          />
        </Grid>
        <div>
          <StyledItemText className={classes.titleWrap} primary="파일업로드 📋" fontSize="18px" color="#00acc1" />
        </div>
        <Grid item className={classes.contentImageWrap}>
          <StyledItemText primary="신분증 업로드" fontSize="15px" className={classes.contentTitle} />
          <Input
            required
            disableUnderline
            color="primary"
            // onChange={(e): void => { readImage(); }}
            type="file"
            className={classes.contentImage}
          />
          <Button>신분증업로드안내</Button>
        </Grid>
        <Grid item className={classes.contentImageWrap}>
          <StyledItemText primary="통장사본" fontSize="15px" className={classes.contentTitle} />
          <Input
            disableUnderline
            required
            color="primary"
            // onChange={(e): void => { readImage(); }}
            type="file"
            className={classes.contentImage}
          />
          <Button>통장사본업로드안내</Button>
        </Grid>
        <div className={classes.titleWraper}>
          <StyledItemText primary="서비스 이용 및 정산등록 동의" fontSize="18px" color="#00acc1" />
        </div>
        <SettlementAgreement setAllCheck={setAllCheck} allCheck={allCheck} />
        <Grid item>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="submit"
              value="Submit"
              color="primary"
            >
              등록
            </Button>
            <Button
              color="primary"
            >
              변경
            </Button>
          </div>
        </Grid>
      </form>
      <Dialog
        open={Boolean(ImageUploadIdentity.open)}
        onClose={ImageUploadIdentity.handleClose}
        fullWidth
        maxWidth="md"
      />
      <Dialog
        open={Boolean(ImageUploadAccount.open)}
        onClose={ImageUploadAccount.handleClose}
        fullWidth
        maxWidth="md"
      />
    </>
  );
}


export default SettlementForm;
