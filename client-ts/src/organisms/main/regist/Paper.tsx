import React, { useState, useReducer } from 'react';
import {
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Grid,
} from '@material-ui/core';
import shortid from 'shortid';
import useStyles from './style/Paper.style';
import Dialog from '../../../atoms/Dialog/Dialog';
import terms from './source/registConfig';


interface CheckState<T> {
  checkedA: T;
  checkedB: T;
  checkedC: T;
  [checkType: string]: T;
}

type CheckAction = { key: 'checkedA'; value: boolean }
  | { key: 'checkedB'; value: boolean }
  | { key: 'checkedC'; value: boolean }
  | { key: 'reset' }

const reducer = (
  state: CheckState<boolean>,
  action: CheckAction
) => {
  switch (action.key) {
    case 'checkedA':
      return { ...state, checkedA: !state.checkedA };
    case 'checkedB':
      return { ...state, checkedB: !state.checkedB };
    case 'checkedC':
      return { ...state, checkedC: !state.checkedC };
    case 'reset':
      return { checkedA: false, checkedB: false, checkedC: false };
    default:
      return state;
  }
};

interface Props {
  handleBack: () => void;
  handleNext: () => void;
}

function PaperSheet({ handleBack, handleNext }: Props): JSX.Element {
  const classes = useStyles();
  const [state, dispatch] = useReducer(
    reducer, { checkedA: false, checkedB: false, checkedC: false }
  );

  const [selectTerm, setTerm] = useState({
    text: '',
    title: '',
    state: ''
  });
  const [open, setOpen] = useState(false);

  function handleChange(name: any): void {
    dispatch({ key: name });
    setOpen(false);
  }

  function handleClose(): void {
    setOpen(false);
  }

  function handleOpen(term: any): void {
    setTerm(term);
    setOpen(true);
  }

  function finishReg(): void {
    if (state.checkedA && state.checkedB) {
      handleNext();
    } else {
      alert('모든 약관에 동의하지 않으면 회원가입이 완료되지 않습니다.');
    }
  }


  return (
    <div>

      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
          While:True
        </Typography>
        {terms.map((term: { title: string; state: string; text: string }) => (
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
                  {term.title}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Button
                      className={classes.buttonStyle}
                      onClick={() => handleOpen(term)}
                    >
                      약관보기
                    </Button>
                  </Grid>
                  <Grid item>
                    <Divider className={classes.divider} />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          onChange={() => { alert('약관보기를 통해 약관을 모두 읽어야 동의가 가능합니다.'); }}
                          checked={state[term.state]}
                          classes={{
                            root: classes.checkboxRoot,
                            checked: classes.checked,
                          }}
                        />
                      )}
                      label="동의"
                      style={{ flex: 2, marginRight: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

        ))}
      </Paper>
      <div className={classes.actionsContainer}>
        <div>
          <Button
            onClick={handleBack}
            className={classes.button}
          >
            뒤로
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={finishReg}
            className={classes.button}
          >
            다음
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        title={selectTerm.title}
        maxWidth="md"
      >
        {/* 계약 내용 */}
        <div className={classes.inDialogContent}>
          {selectTerm.text.split('\n').map((sentence) => (
            <p key={shortid.generate()} className={classes.names}>{sentence}</p>
          ))}
          <Divider />
          <Grid container direction="row" alignContent="center" justify="center">
            <Grid item>
              <p className={classes.names}>위의 내용을 올바르게 이해하셨습니까? 아래 버튼을 클릭하여 약관에 동의해주세요.</p>
            </Grid>
          </Grid>
          <Grid container direction="row" alignContent="center" justify="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleChange(selectTerm.state)}
                className={classes.end}
              >
                {state[selectTerm.state] ? '취소' : '동의'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Dialog>
    </div>
  );
}

export default PaperSheet;
