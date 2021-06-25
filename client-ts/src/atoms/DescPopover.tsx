import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import {
  sendTypeConfig,
  optionConfig,
  budgetConfig,
  landingManageConfig,
  reportConfig,
  reportCardConfig,
} from '../utils/tooltipContentConfig';
import StyledSelectText from './StyledSelectText';

const useStyles = makeStyles(theme => ({
  label: {
    color: theme.palette.info.main,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  text: {
    fontSize: '14px',
  },
  cardText: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
}));

interface DescPopoverProps extends PopoverProps {
  contentType: string;
  descIndex: number;
  handlePopoverClose: () => void;
}

function DescPopover({
  open,
  anchorEl,
  handlePopoverClose,
  anchorOrigin = {
    vertical: 'center',
    horizontal: 'left',
  },
  transformOrigin = {
    vertical: 'center',
    horizontal: 'right',
  },
  descIndex,
  contentType,
  children,
  style,
  ...rest
}: DescPopoverProps): JSX.Element {
  const classes = useStyles(style);

  const getContent = (type: string) => {
    switch (type) {
      case 'priority':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText
                primary={sendTypeConfig[descIndex].title}
                className={classes.label}
              />
            </Grid>
            {sendTypeConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>{row}</Typography>
              </Grid>
            ))}
          </Grid>
        );
      case 'option':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary={optionConfig[descIndex].title} className={classes.label} />
            </Grid>
            {optionConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>{row}</Typography>
              </Grid>
            ))}
          </Grid>
        );
      case 'budget':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary={budgetConfig[descIndex].title} className={classes.label} />
            </Grid>
            {budgetConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>{row}</Typography>
              </Grid>
            ))}
          </Grid>
        );
      case 'landingManage':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText
                primary={landingManageConfig[descIndex].title}
                className={classes.label}
              />
            </Grid>
            {landingManageConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>{row}</Typography>
              </Grid>
            ))}
            {landingManageConfig[descIndex].image ? (
              <img
                style={{ maxWidth: 500 }}
                src={landingManageConfig[descIndex].image}
                alt={landingManageConfig[descIndex].image}
              />
            ) : null}
          </Grid>
        );

      case 'reportTooltip':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary={reportConfig[descIndex].title} className={classes.label} />
            </Grid>
            {reportConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.text}>{row}</Typography>
              </Grid>
            ))}
          </Grid>
        );

      case 'reportCardTooltip':
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <StyledSelectText primary={reportCardConfig[descIndex].title} />
            </Grid>
            {reportCardConfig[descIndex].text.split('\n').map(row => (
              <Grid item key={shortid.generate()}>
                <Typography className={classes.cardText}>{row}</Typography>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return <div />;
    }
  };
  return (
    <Popover
      {...rest}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      id="send-desc-popover"
      className={classes.popover}
      classes={{ paper: classes.paper }}
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
    >
      {children || getContent(contentType)}
    </Popover>
  );
}

export default DescPopover;
