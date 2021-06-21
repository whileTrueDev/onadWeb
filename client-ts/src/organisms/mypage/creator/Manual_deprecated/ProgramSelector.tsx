import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Typography, Avatar } from '@material-ui/core';
import { ManualContentSources } from '../../shared/ManualTypes';

const useStyles = makeStyles(theme => ({
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
}));

interface ProgramSelectorProps {
  source: ManualContentSources;
  handleTypeChange: (programType: 'XSplit Broadcaster' | 'OBS Studio') => void;
}
const ProgramSelector = ({ source, handleTypeChange }: ProgramSelectorProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {source.selectorImages &&
        source.selectorImages.map(image => (
          <ButtonBase
            className={classes.button}
            key={image.title}
            onClick={(): void => {
              if (image.title === 'XSplit Broadcaster' || image.title === 'OBS Studio') {
                handleTypeChange(image.title);
              }
            }}
          >
            <div>
              <Avatar src={image.url} className={classes.bigAvatar} />
              <Typography>{image.title}</Typography>
            </div>
          </ButtonBase>
        ))}
    </div>
  );
};

export default ProgramSelector;
