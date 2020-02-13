import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Button, Collapse
} from '@material-ui/core';

const useStyles = makeStyles(_theme => ({
  button: {
    marginRight: _theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: _theme.spacing(1),
  }
}));

const ButtonSet = (props) => {
  const {
    handleNext, step, handleBack, set
  } = props;
  const classes = useStyles();

  return (
    <Grid container direction="row-reverse">
      <Grid item>
        <Collapse in={set}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.end}
          >
            다음
          </Button>
        </Collapse>
      </Grid>
      <Grid item>
        <Button onClick={handleBack} className={classes.button}>
          뒤로
        </Button>
      </Grid>
    </Grid>
  );
};

export default ButtonSet;
