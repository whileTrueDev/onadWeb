import React from 'react';
import { Grid } from '@material-ui/core';
import StyledItemText from '../../../../../atoms/StyledItemText';
import StyledInput from '../../../../../atoms/StyledInput';
import useInputNameStyles from './InputName.style';

interface InputNameProps {
  nameInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
}

/**
 * @description
 해당 캠페인의 이름을 설정하는 컴포넌트
 
* @param {*} nameDispatch ? campaignName에 대한 error와 data를 설정하는 func
* @param {*} nameState ? campaignName에 대한 error와 data를 저장하는 object
* @author 박찬우
*/
const InputName = (props: InputNameProps): JSX.Element => {
  const classes = useInputNameStyles();
  const { nameInputRef } = props;

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText
            primary="캠페인 이름 입력하기"
            secondary="캠페인 구분을 위해 사용됩니다."
            className={classes.label}
          />
        </Grid>
        <Grid item>
          <StyledInput
            autoFocus
            name="campaign-create-name"
            className={classes.input}
            type="text"
            inputRef={nameInputRef}
            inputProps={{
              minLength: 2,
              required: true
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputName;
