import React, { useEffect } from 'react';
import {
  Grid, Popover, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import StyledSelectText from '../../../../atoms/StyledItemText';
import ContentsPie from './ContentsPie';
import TimeChart from './TimeChart';

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
    width: '500px'
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
    open, anchorEl, type, handlePopoverClose, children, selectedChartData, ...rest
  } = props;
  const classes = useStyles();

  // useEffect(() => {
  //   console.log(selectedChartData);
  // });
  const getContent = (innertype) => {
    switch (innertype) {
      case 'donut':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText
                primary="컨텐츠 분포도"
                className={classes.label}
              />
            </Grid>
            <Grid item lg={12}>
              <ContentsPie selectedChartData={selectedChartData} />
            </Grid>
          </Grid>
        );
      case 'bar':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary="시간대별 방송시간" className={classes.label} />
            </Grid>
            <Grid item>
              <TimeChart selectedChartData={selectedChartData} />
            </Grid>
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
