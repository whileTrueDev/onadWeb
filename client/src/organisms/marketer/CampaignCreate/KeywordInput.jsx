import React from 'react';
import {
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import StyledItemText from '../../../atoms/StyledItemText';
import StyledInput from '../../../atoms/StyledInput';

const useStyles = makeStyles((theme) => ({
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
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
}));


const KeywordInput = (props) => {
  const { dispatch } = props;
  const classes = useStyles();

  const handleChangeName = (event) => {
    switch (event.target.id) {
      case 'keyword0': {
        dispatch({ key: 'keyword0', value: event.target.value });
        return false;
      }
      case 'keyword1': {
        dispatch({ key: 'keyword1', value: event.target.value });
        return false;
      }
      case 'keyword2': {
        dispatch({ key: 'keyword2', value: event.target.value });
        return false;
      }
      default: {
        return false;
      }
    }
  };


  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText primary="키워드 입력하기" secondary="광고 매칭을 위한 키워드를 입력해주세요." className={classes.label} />
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              1.
              <StyledInput className={classes.input} id="keyword0" onChange={handleChangeName} />
            </Grid>
            <Grid item>
              2.
              <StyledInput className={classes.input} id="keyword1" onChange={handleChangeName} />
            </Grid>
            <Grid item>
              3.
              <StyledInput className={classes.input} id="keyword2" onChange={handleChangeName} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default KeywordInput;
