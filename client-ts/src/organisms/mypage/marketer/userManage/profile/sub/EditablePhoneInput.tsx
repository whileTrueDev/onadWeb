import * as React from 'react';
// @material-ui/core
import {
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
  OutlinedInput,
  FormControlProps,
  Typography,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { useToggle } from '../../../../../../utils/hooks';
import phoneNumRegex from '../../../../../../utils/inputs/regex/phoneNum.regex';

const useStyles = makeStyles(theme => ({
  label: {
    fontWeight: 'bold',
  },
  editable: {},
  value: { margin: theme.spacing(1, 0) },
  textField: {
    maxWidth: 320,
    margin: theme.spacing(1, 0),
  },
  switchLabel: {
    fontSize: theme.typography.caption.fontSize,
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
}));

export interface EditableTextField {
  loading?: boolean;
  label: string;
  displayValue: string;
  value: string;
  onChange: (v: NumberFormatValues) => void;
  onSubmit: (value: string) => void;
  onReset: () => void;
  helperText?: string;
  formControlProps?: FormControlProps;
}

export default function EditableTextField({
  loading,
  label,
  displayValue,
  value,
  onChange,
  onSubmit,
  onReset,
  helperText = '전화번호를 모두 채워주세요!',
  formControlProps,
}: EditableTextField): JSX.Element {
  const classes = useStyles();
  const editMode = useToggle();

  const numberType = useToggle(true);

  function submit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={submit}>
      <Typography style={{ fontWeight: 'bold' }}>{label}</Typography>
      {/* 이름 View 모드 */}
      {!editMode.toggle ? (
        <div className={classes.editable}>
          <Typography className={classes.value}>{displayValue}</Typography>
          <Button onClick={editMode.handleToggle} variant="outlined">
            편집
          </Button>
        </div>
      ) : (
        <div className={classes.editable}>
          {/* 편집 모드 */}
          <div>
            <FormControlLabel
              value="phone"
              control={
                <Radio
                  checked={numberType.toggle}
                  onChange={numberType.handleToggle}
                  inputProps={{ 'aria-label': 'phone-mode' }}
                  size="small"
                  color="primary"
                />
              }
              classes={{ label: classes.switchLabel }}
              label="휴대폰/인터넷전화"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="tel"
              control={
                <Radio
                  checked={!numberType.toggle}
                  onChange={numberType.handleToggle}
                  inputProps={{ 'aria-label': 'tel-mode' }}
                  size="small"
                  color="primary"
                />
              }
              classes={{ label: classes.switchLabel }}
              label="회사"
              labelPlacement="bottom"
            />
          </div>
          <FormControl
            margin="dense"
            fullWidth
            className={classes.textField}
            error={!phoneNumRegex.test(value)}
            {...formControlProps}
          >
            <NumberFormat
              placeholder="( ___ ) - ____ - ____"
              value={value}
              onValueChange={onChange}
              customInput={OutlinedInput}
              format={numberType.toggle ? '( ### ) - #### - ####' : '( ### ) - ### - ####'}
              allowNegative={false}
            />
            {!phoneNumRegex.test(value) && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>

          {/* 버튼셋 */}
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              disabled={!value || !phoneNumRegex.test(value) || loading}
            >
              저장
            </Button>
            <Button
              onClick={() => {
                editMode.handleToggle();
                onReset();
              }}
              className={classes.button}
              variant="contained"
            >
              닫기
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
