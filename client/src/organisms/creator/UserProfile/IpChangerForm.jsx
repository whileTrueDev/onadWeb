import React, { useState } from 'react';
import { Input, FormControl, InputLabel } from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import Button from '../../../atoms/CustomButtons/Button';

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[1-9]/, /[0-9]/, /[0-9]/, '.', /[1-9]/, /[0-9]/, /[0-9]/, '.', /[1-9]/, /[0-9]/, /[0-9]/, '.', /[1-9]/, /[0-9]/, /[0-9]/]}
      pipe={(value) => {
        const subips = value.split('.');
        const invalidSubips = subips.filter((ip) => {
          ip = parseInt(ip);
          return ip < 0 || ip > 255;
        });
        return invalidSubips.length > 0 ? false : value;
      }}
      placeholder="IP주소를 입력해주세요."
      keepCharPositions
      placeholderChar={'\u2000'}
      showMask
      style={{
        fontSize: 17,
        width: 400,
      }}
    />
  );
};

const IpChangerForm = (props) => {
  const { classes, localIp } = props;
  const [state, setState] = useState(false);

  const selfButton = () => {
    setState(true);
  };
  const autoButton = () => {
    setState(false);
  };
  return (
    <FormControl
      className={classes.textField}
      required
      margin="normal"
    >
      {state
        ? (
          <FormControl
            className={classes.textField}
            required
            margin="normal"
          >
            <InputLabel>직접 입력하기</InputLabel>
            <Input
              id="ipInput"
              inputComponent={TextMaskCustom}
            />
          </FormControl>
        )
        : (
          <FormControl
            className={classes.textField}
            required
            margin="normal"
          >
            <InputLabel>현재 PC의 IP</InputLabel>
            <Input
              id="ipInput"
              defaultValue={localIp}
              readOnly
            />
          </FormControl>
        )}
      {state ? (
        <Button
          color="info"
          onClick={autoButton}
        >
        현재 PC의 IP 주소
        </Button>
      ) : (
        <Button
          color="info"
          onClick={selfButton}
        >
        직접 입력하러 가기
        </Button>
      )}

    </FormControl>

  );
};

export default IpChangerForm;
