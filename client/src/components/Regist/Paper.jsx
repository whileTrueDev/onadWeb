import React, { useState } from 'react';
import PropTypes from 'prop-types';
import green from '@material-ui/core/colors/green';

import {
  Paper,
  Typography,
  withStyles,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import shortid from 'shortid';
import Dialog from '../Dashboard/components/Dialog/Dialog';
import terms from './registConfig';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  checked: {},
  checkboxRoot: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    display: 'flex',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  inDialogContent: {
    padding: theme.spacing(1),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
});


const PaperSheet = (props) => {
  const {
    handleReset, handleUserSubmit, loading, classes, setLoading,
  } = props;
  const [checkedA, setA] = useState(false);
  const [checkedB, setB] = useState(false);
  const [checkedC, setC] = useState(false);
  const [selectTerm, setTerm] = useState({
    text: '',
  });
  const [open, setOpen] = useState(false);

  const handleChange = name => () => {
    if (name === 'checkedA') {
      setA(!checkedA);
    } else if (name === 'checkedB') {
      setB(!checkedB);
    } else {
      setC(!checkedC);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const getChange = name => this.state.name;

  const handleOpen = term => () => {
    setTerm(term);
    setOpen(true);
  };

  const finishReg = () => {
    if (checkedA && checkedB && checkedC) {
      setLoading(1);
      handleUserSubmit();
    } else {
      alert('모든 약관에 동의하지 않으면 회원가입이 완료되지 않습니다.');
    }
  };


  return (
    <div>
      {loading
        ? (
          <Paper className={classes.root} elevation={1}>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
          회원 등록 중입니다. 잠시만 기다려주세요.
            </Typography>
            <div style={{ textAlign: 'center' }}><CircularProgress /></div>
          </Paper>
        )
        : (
          <Paper className={classes.root} elevation={1}>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
          While:True
            </Typography>
            {terms.map(term => (
              <Paper className={classes.container} elevation={1} key={term.state}>
                <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
                  {term.title}
                </Typography>
                <Button
                  style={{
                    flex: 1, backgroundColor: '#d6d6d6', height: '70%', fontSize: 13,
                  }}
                  onClick={handleOpen(term)}
                >
                약관보기
                </Button>
                <Divider className={classes.divider} />
                <FormControlLabel
                  control={(
                    <Checkbox
                // checked={this.getChange(term.state)}
                      onChange={handleChange(term.state)}
                      value={term.state}
                      classes={{
                        root: classes.checkboxRoot,
                        checked: classes.checked,
                      }}
                    />
              )}
                  label="동의"
                  style={{ flex: 2, marginRight: 0 }}
                />
              </Paper>

            ))}
          </Paper>
        )

      }
      <div className={classes.actionsContainer}>
        <div>
          <Button
            onClick={handleReset}
            className={classes.button}
          >
            다시입력
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={finishReg}
            className={classes.button}
          >
            가입완료
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        title={selectTerm.title}
        buttons={(
          <div>
            <Button onClick={handleClose}>
                    취소
            </Button>
          </div>
            )}
      >
        {/* 계약 내용 */}
        <div className={classes.inDialogContent}>
          {selectTerm.text.split('\n').map(sentence => (
            <p key={shortid.generate()}>{sentence}</p>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
  handleUserSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default withStyles(styles)(PaperSheet);
