import React, { useEffect, useState, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Paper
} from '@material-ui/core';
import StyledItemText from '../../../atoms/StyledItemText';
import CreatorTable from './sub/CreatorTable';

const useStyles = makeStyles(theme => ({
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
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: theme.spacing(1),
  }
}));

// array State를 사용하는 Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'push':
      return [...state, action.value];
    case 'delete':
      return state.filter(item => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const CreatorSelect = (props) => {
  const {
    setStepComplete, creatorList, checkedCreators, checkedCreatorsDispatch,
  } = props;

  const classes = useStyles();
  const [creatorsText, setText] = useState('');
  const [creatorNames, creatorNamesDispatch] = useReducer(reducer, []);

  useEffect(() => {
    const texts = creatorNames.reduce((text, creatorName) => {
      const newText = text.concat(creatorName).concat(', ');
      return newText;
    }, '현재까지 선택된 크리에이터 :  ');
    setText(texts);
    if (checkedCreators.length >= 3) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [checkedCreators, creatorNames, setStepComplete]);

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
            <CreatorTable
              creatorList={creatorList}
              checkedCreators={checkedCreators}
              checkedCreatorsDispatch={checkedCreatorsDispatch}
              creatorNamesDispatch={creatorNamesDispatch}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreatorSelect;
