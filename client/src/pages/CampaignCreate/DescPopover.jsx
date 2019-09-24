import React from 'react';
import {
  Grid, Popover, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import terms from './sendTypeConfig';
import StyledSelectText from '../../components/NewCreates/StyledSelectText';

const useStyles = makeStyles(theme => ({
  label: {
    color: '#455a64',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  choice: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  text: {
    fontSize: '14px',
  }
}));

export default function DescPopover(props) {
  const classes = useStyles();
  const {
    open, anchorEl, handlePopoverClose, descIndex
  } = props;

  return (
    <Popover
      id="send-desc-popover"
      className={classes.popover}
      classes={{
        paper: classes.choice,
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      onClose={handlePopoverClose}
    >
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <StyledSelectText primary={terms[descIndex].title} className={classes.label} />
        </Grid>
        {terms[descIndex].text.split('\n').map(row => (
          <Grid item key={shortid.generate()}>
            <Typography className={classes.text}>
              {row}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Popover>
  );
}
