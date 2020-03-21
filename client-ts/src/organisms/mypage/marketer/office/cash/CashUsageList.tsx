import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
// custom
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import Table from '../../../../../atoms/Table/CashUsageTable';
import CashUsageDialog from './CashUsageDialog';
// import HOST from '../../../../../../config';
// import axios from '../../../../../../utils/axios';
// hooks
import useDialog from '../../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';

const initialData = {
  columns: ['집행 날짜', '집행 금액', '상세보기'],
  data: [
    ['-', '-'],
  ],
};

const useStyles = makeStyles(() => ({
  root: { width: '100%' },
}));

interface UsageInterface { data: string[][] }

export default function CashUsageList(): JSX.Element {
  const classes = useStyles();
  const detailDialog = useDialog();
  const usageData = useGetRequest<null, UsageInterface | null>('/marketer/cash/history/usage');


  return (
    <div className={classes.root}>
      {usageData.loading && (<CircularProgress small />)}
      {!usageData.loading && !usageData.error && usageData.data && (
        <Table
          // tableHeaderColor="info"
          tableHead={initialData.columns}
          tableData={usageData.data.data}
          handleDialogOpen={detailDialog.handleOpen}
          detailButton
        />
      )}

      {!usageData.loading && usageData.data && (
        <div>
          {detailDialog.open && (
            <CashUsageDialog
              open={detailDialog.open}
              handleClose={detailDialog.handleClose}
              data={usageData.data.data[0]}
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
