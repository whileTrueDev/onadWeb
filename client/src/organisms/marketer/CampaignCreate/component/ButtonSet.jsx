import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Button, Collapse
} from '@material-ui/core';
import PropTypes from 'prop-types';

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
    handleNext, handleBack, set
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

/**
 * @description
 캠페인 생성의 각 순서마다 필요한 다음 순서를 진행하기 위한 버튼들

 * @param {*} handleBack ? 뒤로 버튼에 연결
 * @param {*} handleNext ? 다음 버튼에 연결
 * @param {*} set ? 다음 버튼을 누르기 위한 현재 순서에서의 완료를 체크.
 *
 * @author 박찬우
 */
ButtonSet.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  set: PropTypes.bool.isRequired
};


export default ButtonSet;
