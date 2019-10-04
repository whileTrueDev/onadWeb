import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
// custom
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import Table from '../../../../atoms/Table/CashUsageTable';
import CashUsageDialog from './CashUsageDialog';
// import HOST from '../../../../../../config';
// import axios from '../../../../../../utils/axios';
// hooks
import useDialog from '../../../../utils/lib/hooks/useDialog';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const initialData = {
  columns: ['집행 날짜', '집행 금액', '세금계산서', '상세보기'],
  data: [
    ['-', '-', '-'],
  ],
};

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
}));

export default function CashUsageList() {
  const classes = useStyles();
  const detailDialog = useDialog();
  const usageData = useFetchData('/api/dashboard/marketer/cash/usage');
  return (
    <div className={classes.root}>
      {usageData.loading && (<CircularProgress small />)}
      {!usageData.loading && !usageData.error && (
      <Table
        tableHeaderColor="info"
        tableHead={initialData.columns}
        tableData={usageData.payload.data}
        handleDialogOpen={detailDialog.handleOpen}
        detailButton
      />
      )}

      {!usageData.loading && (
      <div>
        {Boolean(detailDialog.open) && (
        <CashUsageDialog
          open={Boolean(detailDialog.open)}
          handleClose={detailDialog.handleClose}
          data={usageData.payload.data[detailDialog.open - 1]}
        />
        )}
      </div>
      )}
    </div>
  );
}

CashUsageList.propTypes = {
};

CashUsageList.defaultProps = {
  userMail: ''
};
