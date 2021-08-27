import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Button, Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(1),
  },
}));

interface ButtonSetProps {
  type?: 'button' | 'reset' | 'submit';
  nextButtonName?: string;
  backButtonName?: string;
  handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  nextButtonOpen: boolean;
  disabled?: boolean;
}

export default function ButtonSet({
  type = 'button',
  nextButtonName = '다음',
  backButtonName = '뒤로',
  handleNext,
  handleBack,
  nextButtonOpen,
  disabled,
}: ButtonSetProps): JSX.Element {
  const classes = useStyles();

  return (
    <Grid container direction="row-reverse">
      <Grid item>
        <Collapse in={nextButtonOpen}>
          <Button
            variant="contained"
            color="primary"
            disabled={disabled}
            type={type}
            onClick={handleNext}
            className={classes.end}
          >
            {nextButtonName}
          </Button>
        </Collapse>
      </Grid>
      <Grid item>
        <Button onClick={handleBack} className={classes.button}>
          {backButtonName}
        </Button>
      </Grid>
    </Grid>
  );
}

/**
 * @description
 캠페인 생성의 각 순서마다 필요한 다음 순서를 진행하기 위한 버튼들

 * @param {*} handleBack ? 뒤로 버튼에 연결
 * @param {*} handleNext ? 다음 버튼에 연결
 * @param {*} set ? 다음 버튼을 누르기 위한 현재 순서에서의 완료를 체크.
 *
 * @author 박찬우
 */
