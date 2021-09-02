import * as React from 'react';
import { Grid, Typography } from '@material-ui/core';
import StyledItemText from '../../../../../atoms/styledItemText';
import StyledInput from '../../../../../atoms/styledInput';
import useInputNameStyles from './inputName.style';

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
            secondary={
              <Typography variant="body2" color="textSecondary">
                캠페인 구분을 위해 사용됩니다.
                <Typography color="error" variant="caption">
                  (최소 2자, 최대 20자)
                </Typography>
              </Typography>
            }
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
              maxLength: 20,
              required: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputName;
