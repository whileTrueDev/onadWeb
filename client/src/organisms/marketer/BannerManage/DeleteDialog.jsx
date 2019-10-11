import React from 'react';
import { DialogTitle, DialogActions } from '@material-ui/core';
import CustomButton from '../../../atoms/CustomButtons/Button';
import Dialog from '../../../atoms/Dialog/Dialog';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

const DeleteDialog = (props) => {
  const {
    open, handleOpen, deleteFunc, bannerId
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
    >
      <GridContainer>

        <DialogTitle>
          {'해당 배너를 삭제하시겠습니까?'}
        </DialogTitle>

        <GridItem xs={12} sm={12} md={12}>
          <DialogActions>
            <CustomButton
              variant="contained"
              color="success"
              size="sm"
              onClick={() => {
                // insert delete function
                deleteFunc(bannerId);
              }}
            >
              {'확인'}
            </CustomButton>
            <CustomButton
              variant="contained"
              color="danger"
              size="sm"
              onClick={handleOpen}
            >
              {'취소'}
            </CustomButton>
          </DialogActions>
        </GridItem>
      </GridContainer>
    </Dialog>
  );
};

export default DeleteDialog;
