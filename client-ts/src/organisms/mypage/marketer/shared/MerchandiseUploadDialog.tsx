import classnames from 'classnames';
import {
  Button, Collapse, FormControl, FormControlLabel,
  makeStyles, Radio, RadioGroup, TextField, Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, {
  useState, useRef
} from 'react';
import { AddressData } from 'react-daum-postcode';
import CustomDialog from '../../../../atoms/Dialog/Dialog';
import {
  useDialog, useEventTargetValue, usePostRequest
} from '../../../../utils/hooks';
import useImageListUpload from '../../../../utils/hooks/useImageListUpload';
import useSwapableListItem from '../../../../utils/hooks/useSwappableListItem';
import { CreateMerchandiseDto, MerchandiseImage, MerchandiseOption } from '../adManage/interface';
import AddressInput, { OnadAddressData } from './sub/MerchandiseAddressInput';
import MerchandiseImageUpload from './sub/MerchandiseImageUpload';
import MerchandiseOptionInput from './sub/MerchandiseOptionInput';
import MerchandiseUploadDialogLoading from './sub/MerchandiseUploadDialogLoading';
import { getS3MerchandiseImagePath } from '../../../../utils/aws/getS3Path';

const FLAG_ON = 'Yes';
const FLAG_OFF = 'No';

const useStyles = makeStyles((theme) => ({
  textField: { margin: theme.spacing(1, 0) },
  textFieldHalf: { width: 300 },
  smallInput: {
    height: 35
  },
  form: { maxHeight: 600, },
  bottomSpace: { marginBottom: theme.spacing(2) },
  field: { margin: theme.spacing(1, 0, 2) },
  emptySpace: { height: theme.spacing(4) },
}));

export interface MerchandiseInfo {
  name: string;
  price: number | string;
  stock: number | string;
  description: string;
}

export interface MerchandiseUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onFail?: () => void;
  recallRequest?: () => void;
}

export default function MerchandiseUploadDialog({
  open,
  onClose,
  onSuccess,
  onFail,
  // recallRequest,
}: MerchandiseUploadDialogProps): JSX.Element {
  const classes = useStyles();

  const optionFlag = useEventTargetValue(FLAG_OFF);
  const pickupFlag = useEventTargetValue(FLAG_OFF);

  // 다이얼로그 컨텐츠 Ref - 스크롤링을 위해
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // *********************************************************
  // 상품정보
  const [merchandiseInfo, setMerchandiseInfo] = useState<MerchandiseInfo>({
    name: '',
    price: '',
    stock: '',
    description: '',
  });

  const handleChange = (
    key: keyof MerchandiseInfo
  ) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMerchandiseInfo({
      ...merchandiseInfo,
      [key]: e.target.value,
    });
  };

  // **********************************************************
  // 상품 픽업 주소
  const [address, setAddress] = useState<OnadAddressData>();

  function handleAddressChangeByDaumPopup(addr: AddressData): void {
    setAddress({
      roadAddress: addr.roadAddress,
      roadAddressEnglish: addr.roadAddressEnglish,
      jibunAddress: addr.jibunAddress,
      jibunAddressEnglish: addr.jibunAddressEnglish,
      buildingCode: addr.buildingCode,
      sido: addr.sido,
      sigungu: addr.sigungu,
      sigunguCode: addr.sigunguCode,
      bname: addr.bname,
      bCode: addr.bcode,
      roadname: addr.roadname,
      roadnameCode: addr.roadnameCode,
      zoneCode: addr.zonecode,
    });
  }
  // 상세 주소
  function handleAddressDetailChange(detail: string): void {
    if (address) {
      setAddress({
        ...address,
        roadAddressDetail: detail,
      });
    }
  }

  // ***********************************************************
  // 상품 이미지
  const {
    images, handleImageUpload, handleImageRemove, uploadToS3
  } = useImageListUpload<MerchandiseImage>({ limit: 4 });

  // 상품 상세 설명 이미지
  const descImages = useImageListUpload<MerchandiseImage>();

  // ***********************************************************
  // 상품 옵션
  const options = useSwapableListItem<MerchandiseOption>([
    { type: '', name: '', additionalPrice: '', },
  ]);
  // 옵션 컴포넌트
  const option = (
    <Collapse in={optionFlag.value === FLAG_ON}>
      <MerchandiseOptionInput
        options={options.items}
        optionOperations={{
          handleChange: options.handleChange,
          addItem: options.addItem,
          removeItem: options.removeItem,
          upItemPosition: options.upItemPosition,
          downItemPosition: options.downItemPosition,
          handleReset: options.handleReset,
        }}
        closeCollapse={(): void => optionFlag.setValue(FLAG_OFF)}
      />
    </Collapse>
  );

  // *************************************************************
  // 상품 등록 백엔드 요청
  const merchandisePost = usePostRequest<CreateMerchandiseDto>('/marketer/merchandises');

  // form error 표시를 위한 변수
  const [formError, setFormError] = useState('');
  const handleFormError = (errMsg: string): void => {
    setFormError(errMsg);
    if (dialogContentRef && dialogContentRef.current) dialogContentRef.current.scrollTo(0, 0);
  };
  const handleFormErrorReset = (): void => { setFormError(''); };

  // form submit 로딩
  const formLoading = useDialog();
  const [formLoadingStatus, setLoadingStatus] = useState<string>();
  function handleLoadingStatus(loadingState: string): void {
    setLoadingStatus(loadingState);
  }
  // 폼 제출 핸들러
  function handleSubmit(): void {
    // 유효성 체크
    if (!merchandiseInfo.name) return handleFormError('상품명을 입력해주세요.');
    if (!merchandiseInfo.price) return handleFormError('판매가를 입력해주세요.');
    if (!merchandiseInfo.stock) return handleFormError('재고를 입력해주세요.');
    if (optionFlag.value === FLAG_ON
      && options.checkItemsEmpty()) return handleFormError('옵션을 올바르게 입력해주세요. 각 옵션은 빈 값이 없어야 합니다.');
    if (images.length === 0) return handleFormError('상품을 등록하기 위해서는 상품 사진이 최소 1개 이상 필요합니다.');
    if (descImages.images.length === 0) return handleFormError('상품을 등록하기 위해서는 상품 상세 사진이 최소 1개 이상 필요합니다.');
    if (pickupFlag.value === FLAG_ON && !address) return handleFormError('상품 픽업 주소를 입력해주세요');
    if (pickupFlag.value === FLAG_ON && address && !address.roadAddressDetail) return handleFormError('상품 픽업 상세 주소를 입력해주세요');
    if (!merchandiseInfo.description) return handleFormError('상세 설명을 입력해주세요.');

    formLoading.handleOpen();
    handleLoadingStatus('상품 등록 중...');
    // 상품 등록 POST 요청
    merchandisePost.doPostRequest({
      ...merchandiseInfo,
      optionFlag: optionFlag.value === FLAG_ON,
      pickupFlag: pickupFlag.value === FLAG_ON,
      pickupAddress: address,
      images: images.map((image) => image.imageName),
      descImages: descImages.images.map((image) => image.imageName),
      options: options.items,
    })
      .then(({ data }) => {
        if (!data) return alert('상품 업로드 중 오류가 발생했습니다. 오류가 지속적으로 발생되면 support@onad.io로 문의부탁드립니다.');

        handleLoadingStatus('상품 사진 등록 중...');
        const { id: uploadedMerchandiseId, marketerId } = data;
        // 상품 사진 S3 업로드
        const key = `merchandises/${marketerId}/${uploadedMerchandiseId}/merchandise`;
        const uploadFailCallback = (err: any) => {
          formLoading.handleClose();
          if (onFail) onFail();
          else alert('상품 사진 업로드 중 오류가 발생했습니다. 오류가 지속적으로 발생되면 support@onad.io로 문의부탁드립니다.');
          console.error(err);
        };
        const uploadSuccessCallback = () => {
          const descImagesKey = getS3MerchandiseImagePath(marketerId, uploadedMerchandiseId);
          // 상품 설명 이미지 업로드
          descImages.uploadToS3(
            descImagesKey,
            () => {
              handleLoadingStatus('상품 상세 설명 이미지 등록 중...');
              formLoading.handleClose();
              if (onSuccess) onSuccess();
              onClose();
            },
            uploadFailCallback
          );
        };
        // 상품 사진 S3 업로드 트리거
        uploadToS3(key, uploadSuccessCallback, uploadFailCallback);
      })
      .catch(onFail);
    // eslint-disable-next-line no-useless-return, consistent-return
    return;
  }

  // 입력 폼
  const form = (
    <form className={classes.form} autoComplete="off">
      {formError && (
      <Alert severity="error" className={classes.bottomSpace}>
        <Typography variant="body2" style={{ marginBottom: 4 }}>
          {formError}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleFormErrorReset}
        >
          확인
        </Button>
      </Alert>
      )}


      <div className={classes.field}>
        <Typography>상품명</Typography>
        <Typography variant="body2" color="textSecondary">상품명은 최대 30자까지 가능합니다.</Typography>
        <TextField
          className={classnames(classes.textField, classes.textFieldHalf)}
          variant="outlined"
          fullWidth
          placeholder="상품명"
          value={merchandiseInfo.name}
          onChange={handleChange('name')}
          InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            maxLength: 30
          }}
        />
      </div>

      <div className={classes.field}>
        <Typography>판매가</Typography>
        <TextField
          className={classnames(classes.textField, classes.textFieldHalf)}
          variant="outlined"
          fullWidth
          placeholder="10000"
          type="number"
          value={merchandiseInfo.price}
          onChange={handleChange('price')}
          InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            min: 0, step: 1
          }}
        />
      </div>

      <div className={classes.field}>
        <Typography>재고</Typography>
        <TextField
          className={classnames(classes.textField, classes.textFieldHalf)}
          variant="outlined"
          fullWidth
          placeholder="10"
          type="number"
          value={merchandiseInfo.stock}
          onChange={handleChange('stock')}
          InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            min: 0, step: 1
          }}
        />
      </div>

      <div className={classes.field}>
        <Typography>옵션 여부</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="option-flag"
            name="optionFlag"
            value={optionFlag.value}
            onChange={optionFlag.handleChange}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <div className={classes.bottomSpace}>
          {option}
        </div>
      </div>

      <div className={classes.field}>
        <Typography>상품픽업여부</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="pickup-flag"
            name="pickupFlag"
            value={pickupFlag.value}
            onChange={pickupFlag.handleChange}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <Collapse in={pickupFlag.value === FLAG_ON}>
          <Typography>픽업주소</Typography>
          <div className={classes.bottomSpace}>
            <AddressInput
              addressValue={address}
              onChange={handleAddressChangeByDaumPopup}
              onDetailChange={handleAddressDetailChange}
            />
          </div>
        </Collapse>
      </div>


      <div className={classes.field}>
        <Typography>상품사진</Typography>
        <Typography color="textSecondary" variant="body2">상품 사진업로드는 사진당 최대 5MB용량까지 가능합니다.</Typography>
        <div className={classes.bottomSpace}>
          <MerchandiseImageUpload
            images={images}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        </div>
      </div>

      <div className={classes.field}>
        <Typography>상품 상세설명</Typography>
        <TextField
          className={classes.textField}
          variant="outlined"
          fullWidth
          placeholder="상세 설명"
          multiline
          rowsMax={10}
          rows={5}
          value={merchandiseInfo.description}
          onChange={handleChange('description')}
        />
      </div>

      <div className={classes.field}>
        <Typography>상품 상세 이미지</Typography>
        <Typography color="textSecondary" variant="body2">상세 사진업로드는 사진당 최대 10MB용량까지 가능합니다.</Typography>
        <MerchandiseImageUpload
          limitMb={10}
          images={descImages.images}
          onImageUpload={(img): void => {
            descImages.handleImageUpload(img);
            if (dialogContentRef.current) {
              dialogContentRef.current.scrollTo(0, dialogContentRef.current.scrollHeight);
            }
          }}
          onImageRemove={descImages.handleImageRemove}
        />
      </div>

      <div className={classes.emptySpace} />

    </form>
  );

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="상품 등록"
      disableScrollTop
      dialogContentRef={dialogContentRef}
      buttons={(
        <div style={{ display: 'flex' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={formLoading.open}
            style={{ marginRight: 8 }}
          >
            등록
          </Button>
          <Button
            disabled={formLoading.open}
            variant="contained"
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      )}
    >
      {form}

      {/* 상품 등록 로딩 */}
      {formLoading.open && (
        <MerchandiseUploadDialogLoading
          title={formLoadingStatus}
        />
      )}
    </CustomDialog>
  );
}