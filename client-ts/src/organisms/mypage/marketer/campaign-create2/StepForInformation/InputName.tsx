import React, { useRef } from 'react';
import { Grid } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import { makeStyles, Theme } from '@material-ui/core/styles';
import StyledItemText from '../../../../../atoms/StyledItemText';
import Success from '../../../../../atoms/Typography/Success';
import DangerTypography from '../../../../../atoms/Typography/Danger';
import StyledInput from '../../../../../atoms/StyledInput';
import { StepForInformationAction, StepForInformationInterface } from '../reducers/stepForInformation';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  item: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      marginBottom: '30px',
      padding: 0,
    },
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  label: {
    color: theme.palette.info.main,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
}));

interface InputNameProps {
  nameState: StepForInformationInterface;
  nameDispatch: React.Dispatch<StepForInformationAction>;
}

const InputName = (props: InputNameProps): JSX.Element => {
  const { nameState, nameDispatch } = props;
  const classes = useStyles();

  // document element 값 접근시 필요.
  const getName = (): string => {
    const nameTag = (document.getElementsByName('campaign-create-name')[0] as HTMLInputElement);
    // if (nameTag) {
    //   if (nameTag.value.length < 2) {
    //     nameDispatch({ key: 'min', value: '' });
    //   }
    //   return nameTag.value;
    // }
    // nameDispatch({ type: 'min', value: '' });
    // return '';
    return nameTag.value;
  };

  const handleChangeName = (): void => {
    const inputName: string = getName();
    if (inputName.length >= 2) {
      nameDispatch({ type: 'SET_NAME', value: inputName });
    }
  };

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
          <Grid container direction="row">
            <Grid item>
              <StyledInput
                autoFocus
                name="campaign-create-name"
                className={classes.input}
                onChange={handleChangeName}
              />
            </Grid>
            {/* <Grid item>
              {(!nameState.error && getName() !== '')
                && (
                  <Success>
                    <Check />
                  </Success>
                )}
            </Grid> */}
          </Grid>
        </Grid>
        {/* <Grid item>
          <DangerTypography>
            {nameState.error && nameState.msg}
          </DangerTypography>
        </Grid> */}
      </Grid>
    </Grid>
  );
};

/**
 * @description
 해당 캠페인의 이름을 설정하는 컴포넌트
 
* @param {*} nameDispatch ? campaignName에 대한 error와 data를 설정하는 func
* @param {*} nameState ? campaignName에 대한 error와 data를 저장하는 object
  * @author 박찬우
  */

export default InputName;
