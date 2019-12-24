import React from 'react';
import {
  Grid, Popover, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import StyledSelectText from '../../../../atoms/StyledItemText';

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
  choice: props => ({
    // padding: theme.spacing(3),
    padding: props.padding === 0 ? 0 : theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  }),
  text: {
    fontSize: '14px',
  },
  cardText: {
    fontSize: '14px',
    fontWeight: 'bold'
  }
}));

function ChartPopover(props) {
  const {
    open, anchorEl, type, handlePopoverClose, children, ...rest
  } = props;
  const classes = useStyles();

  const getContent = (innertype) => {
    switch (innertype) {
      case 'donut':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText
                primary="도넛차트"
                className={classes.label}
              />
            </Grid>
            {/* {sendTypeConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>
                  {row}
                </Typography>
              </Grid>
            ))} */}
          </Grid>
        );
      case 'bar':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary="바차트" className={classes.label} />
            </Grid>
            {/* {optionConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>
                  {row}
                </Typography>
              </Grid>
            ))} */}
          </Grid>
        );
      default:
        return <div />;
    }
  };
  return (
    <Popover
      {...rest}
      id="send-desc-popover"
      className={classes.popover}
      classes={{
        paper: classes.choice
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
    >
      {children || getContent(type)}
    </Popover>
  );
}


// DescPopover.propTypes = {
//   title: PropTypes.node,
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func,
//   buttons: PropTypes.node,
// };

ChartPopover.defaultProps = {
  anchorOrigin:
  {
    vertical: 'center',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
};

export default ChartPopover;
