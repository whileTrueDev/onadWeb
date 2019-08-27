import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../components/Dialog/Dialog';

export default function ImageDialog(props) {
  const {
    open, title, imageSrc, handleDialogClose,
  } = props;
  return (
    <Dialog
      title={title}
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={imageSrc} alt="" style={{ minWidth: 350, maxWidth: 1280, maxHeight: 520 }} />
      </div>
    </Dialog>
  );
}

ImageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  imageSrc: PropTypes.string.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
};

ImageDialog.defaultProps = {
  title: null,
};
