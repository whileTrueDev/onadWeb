import {
  Button, Collapse, FormControl, FormControlLabel,
  makeStyles, Radio, RadioGroup, TextField, Typography
} from '@material-ui/core';
import React, {
  useState, useContext
} from 'react';
import { AddressData } from 'react-daum-postcode';
import CustomDialog from '../../../../atoms/Dialog/Dialog';
import MarketerInfoContext from '../../../../context/MarketerInfo.context';
import { s3UploadImage } from '../../../../utils/aws/OnadAWS';
import { useDialog, useEventTargetValue, usePostRequest } from '../../../../utils/hooks';
import useSwapableListItem from '../../../../utils/hooks/useSwappableListItem';
import { CreateMerchandiseDto, MerchandiseImage, MerchandiseOption } from '../adManage/interface';
import AddressInput, { OnadAddressData } from './sub/MerchandiseAddressInput';
import MerchandiseImageUpload from './sub/MerchandiseImageUpload';
import MerchandiseOptionInput from './sub/MerchandiseOptionInput';
import MerchandiseUploadDialogLoading from './sub/MerchandiseUploadDialogLoading';

const FLAG_ON = 'Yes';
const FLAG_OFF = 'No';

const useStyles = makeStyles((theme) => ({
  textField: {
    margin: theme.spacing(1, 0)
  },
  smallInput: {
    height: 35
  }
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
  const marketerInfo = useContext(MarketerInfoContext);

  const optionFlag = useEventTargetValue(FLAG_OFF);
  const pickupFlag = useEventTargetValue(FLAG_OFF);

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
  // 상품이미지
  const [images, setImages] = useState<MerchandiseImage[]>([]);
  function handleImageUpload(imageData: MerchandiseImage): void {
    if (images.length >= 10) return alert('이미지는 최대 10장까지 업로드 가능합니다.');
    return setImages((prev) => {
      // 이미 동일한 이미지가 업로드 되지 않았을 때만 추가
      if (prev.filter((i) => i.imageName === imageData.imageName).length === 0) {
        return prev.concat(imageData);
      }
      return prev;
    });
  }
  function handleImageRemove(imageName: string): void {
    setImages((prev) => prev.filter((imageData) => imageData.imageName !== imageName));
  }

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

  // form submit 로딩
  const formLoading = useDialog();
  const [formLoadingStatus, setLoadingStatus] = useState<string>();
  function handleLoadingStatus(loadingState: string): void {
    setLoadingStatus(loadingState);
  }
  // 폼 제출 핸들러
  function handleSubmit(): void {
    if (!merchandiseInfo.name) return alert('상품명을 입력해주세요.');
    if (!merchandiseInfo.price) return alert('판매가를 입력해주세요.');
    if (!merchandiseInfo.stock) return alert('재고를 입력해주세요.');
    if (optionFlag.value === FLAG_ON
      && options.checkItemsEmpty()) return alert('옵션을 올바르게 입력해주세요. 각 옵션은 빈 값이 없어야 합니다.');
    if (images.length === 0) return alert('상품을 등록하기 위해서는 상품 사진이 최소 1개 이상 필요합니다.');
    if (pickupFlag.value === FLAG_ON && !address) return alert('상품 픽업 주소를 입력해주세요');
    if (pickupFlag.value === FLAG_ON && address && !address.roadAddressDetail) return alert('상품 픽업 상세 주소를 입력해주세요');
    if (!merchandiseInfo.description) return alert('상세 설명을 입력해주세요.');
    formLoading.handleOpen();
    handleLoadingStatus('상품 등록 중...');
    // 상품 등록 POST 요청
    merchandisePost.doPostRequest({
      ...merchandiseInfo,
      optionFlag: optionFlag.value === FLAG_ON,
      pickupFlag: pickupFlag.value === FLAG_ON,
      pickupAddress: address,
      images: images.map((image) => image.imageName),
      options: options.items,
    }).then(({ data }) => {
      const uploadedMerchandiseId = data.id;
      handleLoadingStatus('상품 사진 등록 중...');
      // 상품 사진 S3 업로드
      images.forEach((image) => {
        if (marketerInfo.user) {
          s3UploadImage({
            key: `merchandises/${marketerInfo.user.marketerId}/${uploadedMerchandiseId}`,
            filename: image.imageName,
            file: image.imageFile,
          }).then(
            () => {
              formLoading.handleClose();
              if (onSuccess) onSuccess();
              onClose();
            },
            (err) => {
              formLoading.handleClose();
              if (onFail) onFail();
              else alert('상품 사진 업로드 중 오류가 발생했습니다. 오류가 지속적으로 발생되면 support@onad.io로 문의부탁드립니다.');
              console.error(err);
            }
          ).catch((err) => {
            formLoading.handleClose();
            if (onFail) onFail();
            else alert('상품 사진 업로드 중 오류가 발생했습니다. 오류가 지속적으로 발생되면 support@onad.io로 문의부탁드립니다.');
            console.error(err);
          });
        }
      });
    });
    // eslint-disable-next-line no-useless-return, consistent-return
    return;
  }

  // 입력 폼
  const form = (
    <form style={{ maxHeight: 600 }} autoComplete="off">
      {/* <Typography>상품 등록 설명 뭐시기 뭐시기</Typography> */}

      <Typography>상품명</Typography>
      <TextField
        className={classes.textField}
        variant="outlined"
        fullWidth
        style={{ maxWidth: 300 }}
        placeholder="상품명"
        value={merchandiseInfo.name}
        onChange={handleChange('name')}
        InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{
          maxLength: 30
        }}
      />

      <Typography>판매가</Typography>
      <TextField
        className={classes.textField}
        variant="outlined"
        fullWidth
        style={{ maxWidth: 300 }}
        placeholder="판매가"
        type="number"
        value={merchandiseInfo.price}
        onChange={handleChange('price')}
        InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{
          min: 0, step: 1
        }}
      />

      <Typography>재고</Typography>
      <TextField
        className={classes.textField}
        variant="outlined"
        fullWidth
        style={{ maxWidth: 300 }}
        placeholder="재고"
        type="number"
        value={merchandiseInfo.stock}
        onChange={handleChange('stock')}
        InputProps={{ className: classes.smallInput }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{
          min: 0, step: 1
        }}
      />

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
      <div style={{ marginBottom: 16 }}>
        {option}
      </div>

      <Typography>픽업여부</Typography>
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
        <div style={{ marginBottom: 16 }}>
          <AddressInput
            addressValue={address}
            onChange={handleAddressChangeByDaumPopup}
            onDetailChange={handleAddressDetailChange}
          />
        </div>
      </Collapse>


      <Typography>사진</Typography>
      <Typography color="textSecondary" variant="body2">상품 사진업로드는 사진당 최대 5MB용량까지 가능합니다.</Typography>
      <div style={{ marginBottom: 16 }}>
        <MerchandiseImageUpload
          images={images}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      </div>

      <Typography>상품 상세설명</Typography>
      <TextField
        className={classes.textField}
        variant="outlined"
        fullWidth
        placeholder="상세설명"
        multiline
        rowsMax={10}
        rows={5}
        value={merchandiseInfo.description}
        onChange={handleChange('description')}
      />
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
