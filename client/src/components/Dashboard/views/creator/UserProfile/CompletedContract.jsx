import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper,
  Typography,
  Grid,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../components/CustomButtons/Button';
import Dialog from '../../../components/Dialog/Dialog';
import terms from './contractionConfig';

const useStyles = makeStyles(theme => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: '#f2f2f2',
    fontSize: 13,
  },
  inDialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    marginLeft: 0,
    marginRight: 0,
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 500,
      fontSize: '10px',
    },
  },
  actionsContainer: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
  termTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}));

function useDialog() {
  const [DialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen(termState) {
    setDialogOpen(termState);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return { DialogOpen, handleDialogOpen, handleDialogClose };
}


function CompletedContract() {
  const classes = useStyles();
  const { DialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

  return (
    <div>
      {terms.map(term => (
        <div key={term.state}>
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="p" className={classes.termTitle}>
                  {term.title}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color="blueGray"
                  onClick={() => handleDialogOpen(term.state)}
                >
                약관보기
                </Button>
              </Grid>
            </Grid>
          </Paper>
          { /* 약관 보기 Dialog */ }
          <Dialog
            open={DialogOpen === term.state}
            onClose={handleDialogClose}
            title={term.title}
          >
            {/* 계약 내용 */}
            <div className={classes.inDialogContent}>
              {term.text.split('\n').map(sentence => (
                <p key={shortid.generate()}>{sentence}</p>
              ))}
            </div>
          </Dialog>
        </div>
      ))}
    </div>
  );
}

export default CompletedContract;
