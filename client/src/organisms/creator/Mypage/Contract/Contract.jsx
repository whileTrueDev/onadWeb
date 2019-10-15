import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper,
  Typography,
  Grid,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import terms from './contractTerms';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';

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
  termTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  dialogTitle: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    marginBottom: '3px',
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
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.dialogTitle}>서비스 이용 및 출금 계약하기</h4>
      </CardHeader>
      <CardBody>
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
              fullWidth
              maxWidth="lg"
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
      </CardBody>
    </Card>
  );
}

export default CompletedContract;
