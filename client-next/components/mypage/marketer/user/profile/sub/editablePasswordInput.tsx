import * as React from 'react';
// @material-ui/core
import { Button, makeStyles, TextField, TextFieldProps, Typography } from '@material-ui/core';
import { useEventTargetValue, useToggle } from '../../../../../../utils/hooks';
import passwordRegex from '../../../../../../utils/inputs/regex/password.regex';

const useStyles = makeStyles(theme => ({
  label: {
    fontWeight: 'bold',
  },
  editable: {},
  value: { margin: theme.spacing(1, 0) },
  textField: {
    maxWidth: 320,
    margin: theme.spacing(1, 1, 1, 0),
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
}));

export interface EditablePasswordInputProps {
  label: string;
  displayValue: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (value: string) => void;
  onReset: () => void;
  helperText?: string;
  textFieldProps?: TextFieldProps;
  loading?: boolean;
}

export default function EditablePasswordInput({
  label,
  displayValue,
  value,
  onChange,
  onSubmit,
  onReset,
  helperText,
  textFieldProps,
  loading,
}: EditablePasswordInputProps): JSX.Element {
  const classes = useStyles();
  const editMode = useToggle();

  const rePassword = useEventTargetValue();

  function submit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!(value === rePassword.value))
      return alert('비밀번호와 비밀번호 확인이 동일하지 않습니다.');
    if (!passwordRegex.test(value)) return alert('비밀번호 형식이 올바르지 않습니다.');
    editMode.handleToggle();
    return onSubmit(value);
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
          <TextField
            className={classes.textField}
            variant="outlined"
            fullWidth
            margin="dense"
            placeholder="비밀번호"
            value={value}
            onChange={onChange}
            inputProps={{ maxLength: 15 }}
            helperText={helperText}
            type="password"
            error={!passwordRegex.test(value)}
            {...textFieldProps}
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            fullWidth
            placeholder="비밀번호 확인"
            margin="dense"
            value={rePassword.value}
            onChange={rePassword.handleChange}
            inputProps={{ maxLength: 15 }}
            type="password"
            error={!(rePassword.value === value)}
            helperText={!(rePassword.value === value) ? '동일한 비밀번호를 입력해주세요.' : ''}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              disabled={
                !(rePassword.value === value) || !value || !passwordRegex.test(value) || loading
              }
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
