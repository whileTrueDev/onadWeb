import React from 'react';
import { Grid } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import StyledItemText from '../../../../../atoms/StyledItemText';
import Success from '../../../../../atoms/Typography/Success';
import DangerTypography from '../../../../../atoms/Typography/Danger';
import StyledInput from '../../../../../atoms/StyledInput';
import { Action, NameInterface } from '../campaignReducer';

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

interface CampaignNamingProps {
  nameState: NameInterface;
  nameDispatch: React.Dispatch<Action>;
}

const CampaignNaming = (props: CampaignNamingProps): JSX.Element => {
  const {
    nameState, nameDispatch
  } = props;
  const classes = useStyles();
  const nameData = useGetRequest('/marketer/campaign/names');

  const checkCampaignName = (value: string): void => {
    if (!nameData.loading && !nameData.error) {
      if (nameData.data.includes(value)) {
        nameDispatch({ key: 'duplicate', value: '' });
      } else {
        nameDispatch({ key: 'set', value });
      }
    }
  };

  // document element 값 접근시 필요.
  const getName = (): string => {
    const nameTag = (document.getElementsByName('name')[0] as HTMLInputElement);
    if (nameTag) {
      if (nameTag.value.length < 2) {
        nameDispatch({ key: 'min', value: '' });
      }
      return nameTag.value;
    }
    nameDispatch({ key: 'min', value: '' });
    return '';
  };

  const handleChangeName = (): void => {
    const inputName = getName();
    if (inputName.length >= 2) {
      checkCampaignName(inputName);
    }
  };

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText primary="캠페인 이름 입력하기" secondary="해당 광고 캠페인의 이름을 입력하세요." className={classes.label} />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <StyledInput
                autoFocus
                name="name"
                className={classes.input}
                onChange={handleChangeName}
              />
            </Grid>
            <Grid item>
              {(!nameState.error && getName() !== '')
                && (
                  <Success>
                    <Check />
                  </Success>
                )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <DangerTypography>
            {nameState.error && nameState.msg}
          </DangerTypography>
        </Grid>
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

export default CampaignNaming;
