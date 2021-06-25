import { useState, useEffect } from 'react';
import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, FormControlLabel, Checkbox, Divider, Grid } from '@material-ui/core';
import shortid from 'shortid';
import sources from '../sources';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import Button from '../../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  warning: {
    backgroundColor: theme.palette.action.disabledBackground,
    padding: theme.spacing(2),
    borderLeft: `0.25rem solid ${theme.palette.error.main}`,
    wordBreak: 'keep-all',
  },
  title: {
    marginBottom: 0,
    paddingLeft: 5,
    color: 'red',
    fontFamily: 'Noto Sans KR',
  },
  content: {
    marginBottom: theme.spacing(4),
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.light,
    },
  },
  divider: { width: 2, height: 28, margin: 10 },
  container: {
    ...theme.mixins.gutters(),
    width: '78%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: '0 auto',
    display: 'flex',
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
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  names: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      fontWeight: 500,
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
      fontWeight: 700,
    },
  },
}));

interface TermInterface {
  title: string;
  state: string;
  text: string;
}

const TestChargeAgreement = (props: {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const classes = useStyles();
  const terms = sources.agreement;
  const { setStepComplete } = props;
  const [checkedA, setA] = useState<boolean>(false);
  const [checkedB, setB] = useState<boolean>(false);
  const [checkedC, setC] = useState<boolean>(false);
  const [checkedD, setD] = useState<boolean>(false);

  const [selectTerm, setTerm] = useState<TermInterface>({
    title: '',
    state: '',
    text: '',
  });
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (name: string) => (): void => {
    if (name === 'checkedA') {
      setA(!checkedA);
      if (!checkedA === true) {
        setB(true);
        setC(true);
        setD(true);
        setStepComplete(true);
      } else {
        setB(false);
        setC(false);
        setD(false);
        setStepComplete(false);
      }
    } else if (name === 'checkedB') {
      setB(!checkedB);
      if (!checkedB === false) {
        setA(false);
        setStepComplete(false);
      }
      if (!checkedB && checkedC && checkedD) {
        setA(true);
        setStepComplete(true);
      }
    } else if (name === 'checkedC') {
      setC(!checkedC);
      if (!checkedC === false) {
        setA(false);
        setStepComplete(false);
      }
      if (checkedB && !checkedC && checkedD) {
        setA(true);
        setStepComplete(true);
      }
    } else {
      setD(!checkedD);
      if (!checkedD === false) {
        setA(false);
        setStepComplete(false);
      }
      if (checkedB && checkedC && !checkedD) {
        setA(true);
        setStepComplete(true);
      }
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (term: TermInterface) => (): void => {
    setTerm(term);
    setOpen(true);
  };

  // const checkAgreement = () => {
  //   if (checkedB && checkedC && checkedD) {
  //     setLoading(1);
  //     handleUserSubmit();
  //   } else {
  //     alert('모든 약관에 동의하지 않으면 캐시충전이 되지 않습니다.')
  //   }
  // }

  const checked = (term: TermInterface): boolean => {
    if (term.state === 'checkedB') {
      return checkedB;
    }
    if (term.state === 'checkedC') {
      return checkedC;
    }
    if (term.state === 'checkedD') {
      return checkedD;
    }
    return checkedA;
  };

  useEffect(() => {
    setStepComplete(false);
  }, [setStepComplete]);

  return (
    <div>
      <blockquote className={classes.warning}>
        <Typography variant="h6" className={classes.title}>
          &raquo; 주의사항
        </Typography>
        <Typography color="textPrimary" variant="body2">
          {sources.content.warning}
        </Typography>
      </blockquote>
      <div>
        {terms.map((term: TermInterface) => (
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
                    {term.state === 'checkedA' ? null : (
                      <Button
                        style={{ flex: 1, height: '70%', fontSize: 13 }}
                        onClick={handleOpen(term)}
                      >
                        전문보기
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Divider className={classes.divider} />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange(term.state)}
                          checked={checked(term)}
                          value={term.state}
                          classes={{
                            root: classes.checkboxRoot,
                            checked: classes.checked,
                          }}
                        />
                      }
                      label="동의"
                      style={{ flex: 2, marginRight: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Dialog
          open={open}
          onClose={handleClose}
          title={selectTerm.title}
          maxWidth="md"
          buttons={
            <div>
              <Button onClick={handleClose}>취소</Button>
            </div>
          }
        >
          {/* 계약 내용 */}
          <div className={classes.inDialogContent}>
            {selectTerm.text.split('\n').map(sentence => (
              <p key={shortid.generate()} className={classes.names}>
                {sentence}
              </p>
            ))}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TestChargeAgreement;
