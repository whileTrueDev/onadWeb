import React, { useEffect, useState, useReducer } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Paper, CircularProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';
import StyledItemText from '../../../atoms/StyledItemText';
import CreatorTable from './CreatorTable';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import { ArrayAction } from '../../../pages/mypage/marketer/campaignReducer';

interface propInterface {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  checkedCreators: string[];
  checkedCreatorsDispatch: React.Dispatch<ArrayAction>;
  priorityType: string | undefined;
  setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
}

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

// array State를 사용하는 Reducer
const reducer = (state: string[], action: { type: string, value: string }) => {
  switch (action.type) {
    case 'push':
      return [...state, action.value];
    case 'delete':
      return state.filter((item: string) => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const CreatorSelect = (props: propInterface) => {
  const {
    setStepComplete, checkedCreators, checkedCreatorsDispatch, priorityType, setSelectedNames
  } = props;

  const classes = useStyles();
  const [creatorsText, setText] = useState('');
  const [creatorNames, creatorNamesDispatch] = useReducer(reducer, []);

  const creatorsData = useGetRequest('/creators');

  useEffect(() => {
    const texts = creatorNames.reduce((text, creatorName) => {
      const newText = text.concat(creatorName).concat(', ');
      return newText;
    }, '현재까지 선택된 크리에이터 :  ');
    setText(texts);
    if (priorityType !== 'type0') {
      return;
    }
    if (checkedCreators.length >= 3) {
      setStepComplete(true);
      setSelectedNames(creatorNames);
    } else {
      setStepComplete(false);
    }
  }, [checkedCreators, creatorNames, priorityType, setSelectedNames, setStepComplete]);

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
                // creatorList={creatorsData.data.map((creator: { creatorId: string, creatorName: string, creatorLogo: string }) => creator.creatorId)}
                checkedCreators={checkedCreators}
                checkedCreatorsDispatch={checkedCreatorsDispatch}
                creatorNamesDispatch={creatorNamesDispatch}
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

 * @param {*} setStepComplete ? 다음 순서로 진행하기 위해 선택된 크리에이터의 수를 체크하는 func
 * @param {*} checkedCreators ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터의 list
 * @param {*} checkedCreatorsDispatch ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터를 저장하는 func
 * @param {*} setSelectedNames ? 선택된 크리에이터를 보여주기 위한 크리에이터 이름 list를 저장하는 func
 * @param {*} priorityType ? 노출 우선형일 경우 list의 저장을 continue하기 위한 state

 * @author 박찬우
 */
CreatorSelect.propTypes = {
  setStepComplete: PropTypes.func.isRequired,
  checkedCreators: PropTypes.array.isRequired,
  checkedCreatorsDispatch: PropTypes.func.isRequired,
  priorityType: PropTypes.string,
  setSelectedNames: PropTypes.func.isRequired
};


export default CreatorSelect;
