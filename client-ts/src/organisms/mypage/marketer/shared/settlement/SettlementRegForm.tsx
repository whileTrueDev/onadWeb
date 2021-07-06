import {
  Button,
  FormControl,
  FormControlLabel,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { useEffect, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import banks, { Bank } from '../../../../../constants/banks';
import { useDialog } from '../../../../../utils/hooks';
import { useMarketerSettlement } from '../../../../../utils/hooks/query/useMarketerSettlement';
import { OnadUploadedImageData } from '../../../../../utils/hooks/useImageListUpload';
import ImageUploadAccount from '../../../shared/settlement/ImageUploadAccount';
import ImageUploadIdentity from '../../../shared/settlement/ImageUploadIdentity';

const useStyles = makeStyles(theme => ({
  field: { margin: theme.spacing(2, 0) },
  fieldTitle: {
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(0, 0, 1),
  },
  textField: {
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(0, 1, 0, 0),
  },
  form: {
    margin: theme.spacing(0, 0, 2),
  },
}));

export interface SettlementRegDTO {
  name: string;
  identificationNumber: string;
  bankName: string;
  bankAccountOwner: string;
  bankAccountNumber: string;
  businessmanFlag: string;
  identificationImgSrc: string;
  bankAccountImgSrc: string;
}

export interface SettlementRegFormProps {
  onSubmit: (dto: Partial<SettlementRegDTO>, reqType?: 'post' | 'patch') => void;
  onCancle?: () => void;
  loading?: boolean;
}
export default function SettlementRegForm({
  onSubmit,
  onCancle,
  loading,
}: SettlementRegFormProps): JSX.Element {
  const classes = useStyles();

  // 판매대금 출금정산을 위한 정산 등록 정보 조회
  const settlement = useMarketerSettlement();

  const [dialogType, setDialogType] = useState<'account' | 'identificaiton'>();
  function handleDialogType(type: 'account' | 'identificaiton'): void {
    setDialogType(type);
  }
  const sampleDialog = useDialog();

  const [dto, setDto] = useState<Omit<SettlementRegDTO, 'bankName'> & { bank: Bank | null }>({
    businessmanFlag: 'false',
    name: '',
    identificationNumber: '',
    bank: null,
    bankAccountOwner: '',
    bankAccountNumber: '',
    identificationImgSrc: '',
    bankAccountImgSrc: '',
  });

  const [requestType, setRequestType] = useState<'post' | 'patch'>('post');
  // 수정의 경우
  useEffect(() => {
    if (settlement && settlement.data) {
      setDto({
        ...settlement.data,
        bank: { bankCode: 'unknown', bankName: settlement.data.bankName },
        businessmanFlag: settlement.data.businessmanFlag ? 'true' : 'false',
      });
      setRequestType('patch');
    }
    // run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange =
    (field: keyof SettlementRegDTO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      e.persist();
      setDto(prev => ({ ...prev, [field]: e.target.value }));
    };

  // ************************************************************
  // 은행 선택 핸들러
  const handleBankSelected = (e: any, bank: Bank | null): void => {
    setDto({ ...dto, bank });
  };
  // ************************************************************
  // 주민등록번호 핸들러
  const handleNumberFormatChange = (d: NumberFormatValues, key: keyof SettlementRegDTO): void => {
    setDto({ ...dto, [key]: d.value });
  };

  // ************************************************************
  // 신분증 업로드 핸들러
  function handleIdentificationImgSrc(imageData: OnadUploadedImageData): void {
    setDto({ ...dto, identificationImgSrc: imageData.imageBase64 });
  }

  // ************************************************************
  // 통장 사본 업로드 핸들러
  function handleBankAccountImgSrc(imageData: OnadUploadedImageData): void {
    setDto({ ...dto, bankAccountImgSrc: imageData.imageBase64 });
  }

  // ************************************************************
  // 기본 이미지 업로드 핸들러
  // eslint-disable-next-line consistent-return
  function readImage(
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (i: OnadUploadedImageData) => void,
  ): void {
    if (e.target.files && e.target.files.length !== 0) {
      const uploadedImage = e.target.files[0];

      const imageName = uploadedImage.name;
      // *******************************
      // 파일 크기 체크
      const limitMb = 5; // 파일 크기 제한 MB
      const MB_LIMIT = 5 * 1024 * 1024;
      if (uploadedImage.size > MB_LIMIT) {
        e.target.value = ''; // 업로드한 파일 제거
        return alert(`${limitMb}MB이하의 파일만 업로드할 수 있습니다.`);
      }

      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);
      reader.onload = (): void => {
        if (reader.result) {
          const imageData = {
            imageFile: uploadedImage,
            imageBase64: reader.result as string,
            imageName,
          };
          callback(imageData);
        }
      };
      reader.onerror = (): void =>
        alert(
          '이미지를 읽는 과정에서 오류가 발생했습니다. 동일 현상이 지속되는 경우, support@onad.io에 문의 바랍니다.',
        );
    }
  }

  return (
    <form className={classes.form}>
      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>유형</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="businessmanFlag"
            name="businessmanFlag"
            value={dto.businessmanFlag}
            onChange={handleChange('businessmanFlag')}
          >
            <FormControlLabel value="false" control={<Radio />} label="비사업자" />
            <FormControlLabel value="true" control={<Radio />} label="사업자" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>
          {dto.businessmanFlag === 'true' ? '회사명' : '성명'}
        </Typography>
        <TextField
          margin="dense"
          variant="outlined"
          value={dto.name}
          onChange={handleChange('name')}
          inputProps={{ maxLength: 20 }}
          className={classes.textField}
        />
      </div>

      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>
          {dto.businessmanFlag === 'true' ? '사업자등록번호' : '주민등록번호'}
        </Typography>
        <NumberFormat
          value={dto.identificationNumber}
          onValueChange={(d): void => handleNumberFormatChange(d, 'identificationNumber')}
          format={dto.businessmanFlag === 'true' ? '### - ## - #####' : '###### - #######'}
          mask="_"
          customInput={OutlinedInput}
          margin="dense"
          allowNegative={false}
          className={classes.textField}
          allowLeadingZeros
        />
        <Typography variant="body2" color="textSecondary">
          {dto.businessmanFlag === 'true'
            ? '사업자등록번호 10자리를 입력해주세요'
            : '주민등록번호 13자리를 입력해주세요'}
        </Typography>
      </div>

      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>은행</Typography>
        <Autocomplete
          options={banks}
          getOptionLabel={options => options.bankName}
          value={dto.bank}
          onChange={handleBankSelected}
          style={{ maxWidth: 240 }}
          renderInput={params => <TextField {...params} margin="dense" />}
        />
      </div>

      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>예금주</Typography>
        <TextField
          margin="dense"
          className={classes.textField}
          variant="outlined"
          value={dto.bankAccountOwner}
          onChange={handleChange('bankAccountOwner')}
          inputProps={{ maxLength: 20 }}
        />
      </div>

      <div className={classes.field}>
        <Typography className={classes.fieldTitle}>계좌번호</Typography>
        <NumberFormat
          value={dto.bankAccountNumber}
          onValueChange={(d): void => handleNumberFormatChange(d, 'bankAccountNumber')}
          allowEmptyFormatting
          customInput={OutlinedInput}
          margin="dense"
          allowNegative={false}
          className={classes.textField}
          allowLeadingZeros
          variant="outlined"
          inputProps={{ maxLength: 16 }}
        />
        <Typography variant="body2" color="textSecondary">
          &quot;-&quot; 을 제외하고 입력하세요
        </Typography>
      </div>

      <div className={classes.field}>
        <div className={classes.fieldTitle}>
          <Typography>
            {dto.businessmanFlag === 'true' ? '사업자 등록증 업로드' : '신분증 업로드'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            이미지, pdf 파일을 업로드할 수 있습니다.
          </Typography>
        </div>
        <Button component="label" color="primary" variant="outlined" className={classes.button}>
          <input
            type="file"
            id="get-registration-file"
            accept="image/*, application/pdf"
            onChange={(e): void => readImage(e, handleIdentificationImgSrc)}
          />
        </Button>
        {!(dto.businessmanFlag === 'true') && (
          <Button
            className={classes.button}
            variant="outlined"
            onClick={() => {
              handleDialogType('identificaiton');
              sampleDialog.handleOpen();
            }}
          >
            예시 보기
          </Button>
        )}
      </div>

      <div className={classes.field}>
        <div className={classes.fieldTitle}>
          <Typography>통장 사본 업로드</Typography>
          <Typography variant="body2" color="textSecondary">
            이미지 파일만 업로드할 수 있습니다.
          </Typography>
        </div>
        <Button component="label" color="primary" variant="outlined" className={classes.button}>
          <input
            type="file"
            id="get-account-file"
            accept="image/*"
            onChange={(e): void => readImage(e, handleBankAccountImgSrc)}
          />
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={() => {
            handleDialogType('account');
            sampleDialog.handleOpen();
          }}
        >
          예시 보기
        </Button>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={(): void => {
          onSubmit({ ...dto, bankName: dto.bank?.bankName }, requestType);
        }}
        disabled={loading}
      >
        등록
      </Button>
      <Button variant="contained" onClick={onCancle}>
        취소
      </Button>

      {dialogType && (
        <CustomDialog
          open={sampleDialog.open}
          onClose={sampleDialog.handleClose}
          title={dto.businessmanFlag === 'true' ? '사업자 등록증 예시' : '신분증 예시'}
        >
          {dialogType === 'account' && <ImageUploadAccount />}
          {dialogType === 'identificaiton' && <ImageUploadIdentity />}
        </CustomDialog>
      )}
    </form>
  );
}
