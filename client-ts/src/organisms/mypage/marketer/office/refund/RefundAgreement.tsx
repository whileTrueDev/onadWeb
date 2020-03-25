import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Paper, Typography, FormControlLabel,
  Checkbox, Divider, Grid,
} from '@material-ui/core';
import shortid from 'shortid';
import sources from '../sources';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import Button from '../../../../../atoms/CustomButtons/Button';
import { Action } from '../interface';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  warning: {
    backgroundColor: theme.palette.action.disabledBackground,
    borderLeft: `0.25rem solid ${theme.palette.error.main}`,
    wordBreak: 'keep-all'
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
    color: theme.palette.success.light,
    '&$checked': {
      color: theme.palette.success.light
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
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

interface RefundAgreementProps {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  dispatch: React.Dispatch<Action>;
}

const RefundAgreement = (props: RefundAgreementProps): JSX.Element => {
  const classes = useStyles();
  const terms = sources.contentRefund;
  const { setStepComplete, checked, dispatch } = props;

  useEffect(() => {
    setStepComplete(false);
  }, [setStepComplete]);

  const [open, setOpen] = useState(false);
  const handleClose = (): void => {
    setOpen(false);
  };
  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleChange = (): void => {
    dispatch({ key: 'checked', value: !checked });
    if (!checked) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  };


  return (
    <div>
      <blockquote className={classes.warning}>
        <h4 className={classes.title}>&raquo; 주의사항</h4>
        <p className={classes.content}>{terms.agreementSub}</p>
      </blockquote>
      <div>
        <Paper className={classes.container} elevation={1}>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
            <Grid item>
              <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
                {terms.itemTitle}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <Button
                    style={{
                      flex: 1, height: '70%', fontSize: 13,
                    }}
                    onClick={handleOpen}
                  >
                    전문보기
                  </Button>
                </Grid>
                <Grid item>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        onChange={handleChange}
                        checked={checked}
                        value={terms.agreementSub}
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

        <Dialog
          open={open}
          onClose={handleClose}
          title={terms.itemTitle}
          maxWidth="md"
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
            {terms.agreement.split('\n').map((sentence: string) => (
              <p key={shortid.generate()} className={classes.names}>{sentence}</p>
            ))}
          </div>
        </Dialog>

      </div>
    </div>

  );
};

export default RefundAgreement;
