import React from 'react';
import shortid from 'shortid';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import ImageDialog from './ImageDialog';

const useStyles = makeStyles(theme => ({
  root: { marginTop: theme.spacing(3) },
  image: {
    position: 'relative',
    height: 330,
    float: 'right',
    width: '45%', // Overrides inline-style
    [theme.breakpoints.down('md')]: {
      width: '100% !important', // Overrides inline-style
      height: 200,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
    },
    cursor: 'zoom-in',
  },
  focusVisible: {},
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
}));

const useDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState('');

  function handleDialogOpen() {
    setOpen(true);
  }
  function handleDialogClose() {
    setOpen(false);
  }
  function handleImageChange(src) {
    setImageSrc(src);
  }
  return {
    open, handleDialogOpen, handleDialogClose, imageSrc, handleImageChange,
  };
};

const ManualDetailDetail = (props) => {
  const { source } = props;
  const {
    open, handleDialogOpen, handleDialogClose, imageSrc, handleImageChange,
  } = useDialog();
  const classes = useStyles();

  return (
    <Stepper orientation="vertical" className={classes.root}>
      {source.map(value => (
        <Step active key={shortid.generate()}>
          <StepLabel>
            {value.description.split('\n').map(row => (
              <Typography key={shortid.generate()} variant="body1">
                {row}
              </Typography>
            ))}
          </StepLabel>
          <StepContent>
            {value.image && (
            <ButtonBase
              focusRipple
              key={shortid.generate()}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              onClick={() => { handleImageChange(value.image); handleDialogOpen(); }}
            >
              <div
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${value.image})`,
                }}
              />
            </ButtonBase>
            )}
          </StepContent>
        </Step>
      ))}

      <ImageDialog open={open} handleDialogClose={handleDialogClose} imageSrc={imageSrc} />

    </Stepper>
  );
};

export default ManualDetailDetail;
