import { Button, makeStyles, TextField } from '@material-ui/core';
import { useMemo } from 'react';
import * as React from 'react';
import { AddressData } from 'react-daum-postcode';
import { useDialog } from '../../../../../utils/hooks';
import DaumPostCodeDialog from '../DaumPostCodeDialog';
import { OnadAddressData } from '../../../../../utils/hooks/query/useMarketerMerchandisesAddresses';

const useStyles = makeStyles(theme => ({
  textfield: {
    margin: theme.spacing(0.5, 0),
  },
  input: {
    height: 35,
  },
  rightSpace: {
    marginRight: theme.spacing(1),
  },
}));

export interface MerchandiseAddressInputProps {
  textfieldClassName?: string;
  inputClassName?: string;
  addressValue?: OnadAddressData;
  onChange: (
    addr: Omit<AddressData, 'zonecode' | 'bcode'> & { zoneCode: string; bCode: string },
  ) => void;
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

  const addressTextField = useMemo(
    () => (
      <>
        <TextField
          className={textfieldClassName || classes.textfield}
          variant="outlined"
          fullWidth
          style={{ maxWidth: 100, marginRight: 8 }}
          placeholder="우편번호"
          InputProps={{
            className: inputClassName || classes.input,
            readOnly: true,
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
            readOnly: true,
          }}
          value={!addressValue ? '' : addressValue.roadAddress}
        />
      </>
    ),
    [addressValue, classes.input, classes.textfield, inputClassName, textfieldClassName],
  );

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
