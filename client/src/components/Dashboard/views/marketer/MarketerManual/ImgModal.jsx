import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const rand = () => Math.round(Math.random() * 20) - 10;

const getModalStyle = () => {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};


const ModalStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
    border:'0'
  },
}));

const ImgModal = ({ ...props }) => {
  const { openModal, handleClose, ImgSrc } = props;
  const ModalClasses = ModalStyles();
  const [modalStyle] = React.useState(getModalStyle);


  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openModal}
      onClose={handleClose}
    >
      <div style={modalStyle} className={ModalClasses.paper}>
        <img src={ImgSrc} alt="" width="100%" height="100%" />
      </div>
    </Modal>
  );
};
export default ImgModal;
