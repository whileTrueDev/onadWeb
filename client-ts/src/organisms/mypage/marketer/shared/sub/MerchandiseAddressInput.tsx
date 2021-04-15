
import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useMemo } from 'react';
import { AddressData } from 'react-daum-postcode';
import { useDialog } from '../../../../../utils/hooks';
import DaumPostCodeDialog from '../DaumPostCodeDialog';

const useStyles = makeStyles((theme) => ({
  textfield: {
    margin: theme.spacing(0.5, 0),
  },
  input: {
    height: 35
  },
  rightSpace: {
    marginRight: theme.spacing(1)
  }
}));

export interface OnadAddressData {
  id?: number;
  roadAddress: string; // 도로명 주소
  roadAddressEnglish: string; // 도로명 영어 주소
  roadAddressDetail?: string; // 사용자 입력 상세 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish: string; // 지번 영어 주소
  buildingCode: string; // 건물 코드
  sido: string; // 시/도
  sigungu: string; // 시군구 이름
  sigunguCode: string; // 시군구 코드
  bname: string; // 법정동 이름
  bCode: string; // 법정동 코드
  roadname: string; // 도로명
  roadnameCode: string; // 도로명코드
  zoneCode: string; // 우편번호
}
export interface MerchandiseAddressInputProps {
  textfieldClassName?: string;
  inputClassName?: string;
  addressValue?: OnadAddressData;
  onChange: (addr: Omit<AddressData, 'zonecode' | 'bcode'> & { zoneCode: string; bCode: string }) => void;
  onDetailChange: (detail: string) => void;
}

export default function MerchandiseAddressInput({
  textfieldClassName,
  inputClassName,
  addressValue,
  onChange,
  onDetailChange,
}: MerchandiseAddressInputProps): React.ReactElement {
  const classes = useStyles();

  const addressTextField = useMemo(() => (
    <>
      <TextField
        className={textfieldClassName || classes.textfield}
        variant="outlined"
        fullWidth
        style={{ maxWidth: 100, marginRight: 8 }}
        placeholder="우편번호"
        InputProps={{
          className: inputClassName || classes.input,
          readOnly: true
        }}
        value={!addressValue ? '' : addressValue.zoneCode}
      />
      <TextField
        className={textfieldClassName || classes.textfield}
        variant="outlined"
        fullWidth
        style={{ maxWidth: 300 }}
        placeholder="주소"
        InputProps={{
          className: inputClassName || classes.input,
          readOnly: true
        }}
        value={!addressValue ? '' : addressValue.roadAddress}
      />
    </>
  ), [addressValue, classes.input, classes.textfield, inputClassName, textfieldClassName]);

  const postcodeDialog = useDialog();

  return (
    <div>
      <Button variant="contained" color="primary" onClick={postcodeDialog.handleOpen}>
        주소 찾기
      </Button>
      {addressValue && (
      <div>
        {addressTextField}

        <TextField
          className={textfieldClassName || classes.textfield}
          variant="outlined"
          fullWidth
          style={{ maxWidth: 200 }}
          placeholder="상세 주소"
          InputProps={{ className: inputClassName || classes.input }}
          value={addressValue.roadAddressDetail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            onDetailChange(e.target.value);
          }}
        />
      </div>
      )}

      <DaumPostCodeDialog
        open={postcodeDialog.open}
        onClose={postcodeDialog.handleClose}
        onComplete={(data): void => {
          onChange({ ...data, zoneCode: data.zonecode, bCode: data.bcode });
          postcodeDialog.handleClose();
        }}
      />
    </div>
  );
}
