import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import StyledItemText from '../../../../../atoms/StyledItemText';
import DangerTypography from '../../../../../atoms/Typography/Danger';
import StyledInput from '../../../../../atoms/StyledInput';
import { Action, DescriptionInterface } from '../campaignReducer';

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
    width: '400px',
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

interface InputDescriptionProps {
  descriptionState: DescriptionInterface;
  descriptionDispatch: React.Dispatch<Action>;
}

// 홍보 문구 글자 수 제한
const DESCRIPTION_LENGHT_LIMIT = 50;

const InputDescription = (props: InputDescriptionProps): JSX.Element => {
  const {
    descriptionState, descriptionDispatch
  } = props;
  const classes = useStyles();

  // document element 값 접근시 필요.
  const getDescription = (): string => {
    const descriptionTag = (document.getElementsByName('description')[0] as HTMLInputElement);
    if (descriptionTag) {
      if (descriptionTag.value.length > DESCRIPTION_LENGHT_LIMIT) {
        descriptionDispatch({ key: 'limitExceeded', value: '' });
      }
      return descriptionTag.value;
    }
    return '';
  };

  const handleChangeName = (): void => {
    const inputDescription: string = getDescription();
    if (inputDescription.length < DESCRIPTION_LENGHT_LIMIT) {
      descriptionDispatch({ key: 'set', value: inputDescription });
    }
  };

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
          <Grid container direction="row">
            <Grid item>
              <StyledInput
                autoFocus
                error={descriptionState.error}
                name="description"
                className={classes.input}
                onChange={handleChangeName}
              />
              {descriptionState.error && (
                <DangerTypography>
                  {DESCRIPTION_LENGHT_LIMIT}
                  자 이내로 입력하세요.
                </DangerTypography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputDescription;
