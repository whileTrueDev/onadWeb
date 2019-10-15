import React from 'react';
// for Link tag component
// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import CustomButton from '../../atoms/CustomButtons/Button';

import BannerTable from '../../organisms/marketer/BannerManage/BannerTable';
import UploadDialog from '../../organisms/marketer/BannerManage/UploadDialog';
import DeleteDialog from '../../organisms/marketer/BannerManage/DeleteDialog';

// core ../../atoms
import dashboardStyle from '../../assets/jss/onad/views/dashboardStyle';

import useDialog from '../../utils/lib/hooks/useDialog';

const BannerManage = () => {
  const deleteDialog = useDialog();
  const uploadDialog = useDialog();

  return (
    <GridContainer>
      <GridItem xs={12} xl={10}>
        <CustomButton color="info" size="lg" onClick={() => { uploadDialog.handleOpen(); }}>
          + 새 배너 등록
        </CustomButton>
        <BannerTable handleDeleteOpen={deleteDialog.handleOpen} />
      </GridItem>

      <UploadDialog
        open={uploadDialog.open}
        onClose={uploadDialog.handleClose}
      />
      {Boolean(deleteDialog.open) && (
        <DeleteDialog
          open={Boolean(deleteDialog.open)}
          selectedBanner={deleteDialog.open}
          handleClose={deleteDialog.handleClose}
        />
      )}

    </GridContainer>

  );
};

export default withStyles(dashboardStyle)(BannerManage);
