import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper,
  Typography,
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
    display: 'flex',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  inDialogContent: {
    padding: theme.spacing(1),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  actionsContainer: {
    marginTop: theme.spacing(1),
    float: 'right',
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


function CompletedContract(props) {
  const classes = useStyles();
  const { DialogOpen, handleDialogOpen, handleDialogClose } = useDialog();

  return (
    <div>
      {terms.map((term, index) => (
        <div key={term.state}>
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
              {term.title}
            </Typography>
            <Button
              color="blueGray"
              onClick={() => handleDialogOpen(term.state)}
            >
              약관보기
            </Button>

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
