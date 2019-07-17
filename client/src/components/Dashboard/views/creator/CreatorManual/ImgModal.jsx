import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const rand = () => {
  return Math.round(Math.random() * 20) - 10;
}

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const ModalStyles = makeStyles(theme => ({
  paper: {
    position: 'relative',
    width: "80%",
    height: "60%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
  },
}));

 const ImgModal = ({...props}) => {
  const { openModal, handleClose,  ImgSrc } = props;
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
      <img src={ImgSrc} alt="" width="100%" height="100%"/>
    </div>
  </Modal>
  );
}
export default ImgModal;