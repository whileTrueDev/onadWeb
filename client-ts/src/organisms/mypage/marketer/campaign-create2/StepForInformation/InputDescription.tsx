import React from 'react';
import { Grid } from '@material-ui/core';
import StyledItemText from '../../../../../atoms/StyledItemText';
import StyledInput from '../../../../../atoms/StyledInput';
import useStyles from './InputDescription.style';

interface InputDescriptionProps {
  descriptionInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
}

const InputDescription = (props: InputDescriptionProps): JSX.Element => {
  const { descriptionInputRef } = props;
  const classes = useStyles();

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText
            primary="홍보 문구 입력하기"
            secondary="광고 홍보 문구를 입력해 주세요. 채팅광고의 문구로 사용되어, 시청자에게 직접 노출됩니다. (최대 50자)"
            className={classes.label}
          />
        </Grid>
        <Grid item>
          <StyledInput
            autoFocus
            name="campaign-create-description"
            className={classes.input}
            inputRef={descriptionInputRef}
            inputProps={{
              required: true
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputDescription;
