import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  ButtonBase,
  Typography,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  bigAvatar: {
    boxShadow: '0 10px 30px 7px rgba(102, 102, 102, 0.5)',
    margin: 25,
    width: 200,
    height: 200,
    [theme.breakpoints.down('md')]: {
      width: 125,
      height: 125,
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 100,
    },
    '&:hover': {
      opacity: 0.75,
    },
  },
});

const ProgramSelector = (props) => {
  const { classes, source, handleTypeChange } = props;

  return (
    <div className={classes.root}>
      {source.selectorImages.map(image => (
        <ButtonBase
          className={classes.button}
          key={image.title}
          onClick={() => { handleTypeChange(image.title); }}
        >
          <div>

            <Avatar alt={image.title} src={image.url} className={classes.bigAvatar} />
            <Typography>{image.title}</Typography>
          </div>
        </ButtonBase>
      ))}
    </div>
  );
};

ProgramSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

ProgramSelector.defaultProps = {
};

export default withStyles(styles)(ProgramSelector);
