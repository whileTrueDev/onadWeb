import * as React from 'react';
// @material-ui/core
import { Button, makeStyles, TextField, TextFieldProps, Typography } from '@material-ui/core';
import { useToggle } from '../../utils/hooks';

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
  button: {
    margin: theme.spacing(0, 1, 0, 0),
  },
}));

export interface EditableTextFieldProps {
  inputProps?: TextFieldProps['inputProps'];
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

export default function EditableTextField({
  inputProps,
  label,
  displayValue,
  value,
  onChange,
  onSubmit,
  onReset,
  helperText,
  textFieldProps,
  loading,
}: EditableTextFieldProps): JSX.Element {
  const classes = useStyles();
  const editMode = useToggle();

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
          <TextField
            className={classes.textField}
            variant="outlined"
            fullWidth
            margin="dense"
            value={value}
            onChange={onChange}
            inputProps={inputProps}
            helperText={helperText}
            {...textFieldProps}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              disabled={textFieldProps?.error || !value || loading}
            >
              저장
            </Button>
            <Button
              onClick={(): void => {
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
