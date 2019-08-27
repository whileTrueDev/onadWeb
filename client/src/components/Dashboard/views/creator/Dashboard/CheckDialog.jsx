import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
  const {open, setOpen, handleBannerDelete} = props;

  function handleClose() {
    setOpen(false);
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
      <DialogTitle id="alert-dialog-title">해당 배너를 삭제하시겠습니까?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          * 삭제시 해당 배너는 더 이상 당신에게 게시되지 않습니다.
        </DialogContentText>
        <DialogContentText>
          * 지금까지 게시한 내역은 정산됩니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBannerDelete} color="primary">
          확인
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
