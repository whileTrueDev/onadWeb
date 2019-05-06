import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Modal, Typography, Divider,
} from '@material-ui/core';
import clsx from 'clsx';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
  },
});

const ImageModal = (props) => {
  const {
    isImageModalOpen,
    setIsImageModalOpen,
    classes,
    image,
  } = props;

  function handleClose() {
    setIsImageModalOpen(false);
  }

  return (
    <Modal
      closeAfterTransition="true"
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={isImageModalOpen}
      onClose={handleClose}
    >
      <div className={clsx(classes.paper, classes.modal)}>
        <Typography
          className={classes.title}
          variant="h6"
          id="image-modal-title"
        >
          {image.title}
        </Typography>
        <Divider />
        <Typography
          className={classes.description}
          variant="subtitle1"
          id="image-modal-description"
        >
          {image.fullDescription}
        </Typography>
      </div>
    </Modal>
  );
};

ImageModal.propTypes = {
  isImageModalOpen: PropTypes.bool.isRequired,
  setIsImageModalOpen: PropTypes.func.isRequired,
  classes: PropTypes.shape(PropTypes.object),
  image: PropTypes.shape(PropTypes.object),
};

ImageModal.defaultProps = {
  classes: {},
  image: {
    title: '',
    fullDescription: '',
  },
};

export default withStyles(styles)(ImageModal);
