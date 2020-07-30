import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, CircularProgress
} from '@material-ui/core';
import StyledItemText from '../../../../../atoms/StyledItemText';
import CreatorTable from './CreatorSelectTable';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import { CampaignCreateInterface, CampaignCreateAction } from '../reducers/campaignCreate.reducer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  choice: {
    padding: theme.spacing(3),
    margin: '16px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));


interface CreatorSelectProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleComplete: () => void;
  handleIncomplete: () => void;
  priorityType?: string;
}
const CreatorSelect = (props: CreatorSelectProps): JSX.Element => {
  const {
    state, dispatch, handleComplete, handleIncomplete
  } = props;
  const classes = useStyles();

  // **********************************************************
  // 게임데이터 로딩 및 클릭 핸들러
  const creatorsData = useGetRequest('/creators');

  // **********************************************************
  // "다음" 버튼 핸들러
  useEffect(() => {
    if (state.selectedPriorityType !== 'type0') {
      return;
    }
    if (state.selectedCreators.length >= 1) {
      handleComplete();
    } else {
      handleIncomplete();
    }
  }, [handleComplete, handleIncomplete, state.selectedCreators.length, state.selectedPriorityType]);

  // **********************************************************
  // 선택된 크리에이터 이름 핸들러
  const [creatorsText, setText] = useState('');
  useEffect(() => {
    const texts = state.selectedCreatorNames.reduce((text, creatorName) => {
      const newText = text.concat(creatorName).concat(', ');
      return newText;
    }, '현재까지 선택된 크리에이터 :  ');

    setText(texts);
  }, [state.selectedCreatorNames]);

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Paper className={classes.choice}>
              <StyledItemText primary={creatorsText} />
            </Paper>
          </Grid>
          <Grid item>
            {creatorsData.loading && (
              <div style={{ padding: 72, textAlign: 'center' }}>
                <CircularProgress size={100} disableShrink />
              </div>
            )}
            {!creatorsData.loading && creatorsData.data && (
              <CreatorTable
                checkedCreators={state.selectedCreators}
                dispatch={dispatch}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 우선형을 크리에이터 우선형으로 선택하여 송출될 크리에이터의 데이터를 확인하고 선택하기 위한 컴포넌트

 * @param {*} checkedCreators ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터의 list
 * @param {*} dispatch ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터를 저장하는 func
 * @param {*} setSelectedNames ? 선택된 크리에이터를 보여주기 위한 크리에이터 이름 list를 저장하는 func
 * @param {*} priorityType ? 노출 우선형일 경우 list의 저장을 continue하기 위한 state

 * @author 박찬우
 */


export default CreatorSelect;
