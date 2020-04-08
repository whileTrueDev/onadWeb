// AccountNumber를 입력하는 Form component 작성
import React, {
  useState, useReducer
} from 'react';
import {
  TextField, MenuItem, Grid, Dialog
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Button from '../../../../../atoms/CustomButtons/Button';
import banks from './banks';
import settlementFormReducer from './Settlement.reducer';
import usePatchRequest from '../../../../../utils/hooks/usePatchRequest';
import StyledItemText from '../../../../../atoms/StyledItemText';
import useDialog from '../../../../../utils/hooks/useDialog';
import SettlementAgreement from './SettlementAgreement';
import ImageUploadIdentity from './ImageUploadIdentity';
import ImageUploadAccount from './ImageUploadAccount';

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
  handleSnackOpen: () => void;
  CreatorType: number;
}
interface ImageData {
  newImageUrl: string | ArrayBuffer | null;
  index: number;
}

function SettlementForm({
  handleSnackOpen, CreatorType
}: SettlementFormProps): JSX.Element {
  const classes = useStyles();
  const ImageUploadID = useDialog();
  const ImageUploadAC = useDialog();
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

  const MB = 1048576; // 1Mbytes
  const IMAGE_SIZE_LIMIT = 10 * MB;

  // 신분증 이미지
  const [creatorIDImg, setCreatorIDImg] = React.useState<string | ArrayBuffer | null>('');

  // 통장사본 이미지
  const [creatorBussinessImg, setCreatorBussinessImg] = React.useState<string | ArrayBuffer | null>('');

  // image reset
  function handleReset(index: number): void {
    switch (index) {
      case 1:
        return setCreatorIDImg('');
      default:
        return setCreatorBussinessImg('');
    }
  }

  // image change handler
  function handleImageChange({ newImageUrl, index }: ImageData): void {
    switch (index) {
      case 1:
        return setCreatorIDImg(newImageUrl);
      default:
        return setCreatorBussinessImg(newImageUrl);
    }
  }

  const readImage = (event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const target = event.target as HTMLInputElement;
    const files = (target.files as FileList);
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];

      // image 확장자 검사
      if (fileRegx.test(myImage.type)) {
        // 이미지 사이즈 검사
        if (myImage.size < IMAGE_SIZE_LIMIT) {
          // 사이즈 제한보다 작은 경우
          const reader = new FileReader();
          reader.readAsDataURL(myImage);
          reader.onload = (): void => {
            handleImageChange({ newImageUrl: reader.result, index });
          };
        } else {
          // 사이즈 제한보다 큰 경우
          alert('10MB 이하의 이미지를 업로드해주세요.');
        }
      } else {
        alert('파일의 형식이 올바르지 않습니다.');
      }
    } else {
      handleReset(index);
    }
  };

  // 이용약관 올체크
  const [allCheck, setAllCheck] = useState({
    checkA: false,
    checkB: false,
    checkC: false
  });

  // 정산시스템 등록을 위한 요청 객체 생성 ===> 정산시스템 patch로
  const settlementPatch = usePatchRequest('/creator/settlement', () => {
    handleSnackOpen();
  });

  const handleSubmit = (event: React.MouseEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const creatorData = {
      bankName: bankState.name,
      bankRealName: realName,
      bankAccount: accountNum,
      CreatorName: creatorName,
      CreatorIdentity: creatorIdentity,
      CreatorPhone: creatorPhone,
      CreatorIDImg: creatorIDImg,
      CreatorAccountImg: creatorBussinessImg,
      CreatorType
    };

    // usePostRequest
    settlementPatch.doPatchRequest({ ...creatorData });
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
          <input
            required
            accept="image/*"
            color="primary"
            onChange={(e): void => { readImage(e, 1); }}
            type="file"
            className={classes.contentImage}
          />
          <Button onClick={ImageUploadID.handleOpen}>신분증업로드안내</Button>
        </Grid>
        <Grid item className={classes.contentImageWrap}>
          <StyledItemText primary="통장사본" fontSize="15px" className={classes.contentTitle} />
          <input
            required
            accept="image/*"
            color="primary"
            onChange={(e): void => { readImage(e, 2); }}
            type="file"
            className={classes.contentImage}
          />
          <Button onClick={ImageUploadAC.handleOpen}>통장사본업로드안내</Button>
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
        open={Boolean(ImageUploadID.open)}
        onClose={ImageUploadID.handleClose}
        fullWidth
        maxWidth="md"
      >
        <ImageUploadIdentity />
      </Dialog>
      <Dialog
        open={Boolean(ImageUploadAC.open)}
        onClose={ImageUploadAC.handleClose}
        fullWidth
        maxWidth="md"
      >
        <ImageUploadAccount />
      </Dialog>
    </>
  );
}


export default SettlementForm;
