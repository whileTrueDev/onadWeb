import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '../../../../atoms/Dialog/Dialog';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import Table from '../../../../atoms/Table/CashUsageTable';

const initialData = {
  data: [['-', '-', '-']]
};

const useStyles = makeStyles(() => ({
  flex: { display: 'flex', alignItems: 'center' }
}));

export default function CashUsageDialog(props) {
  const classes = useStyles();
  const { open, handleClose, data } = props;
  const usagePerMonthData = useFetchData('/api/dashboard/marketer/cash/usage/month', {
    month: data[0]
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={`${data[0]} 상세보기`}
      maxWidth="sm"
      fullWidth
    >
      <div>
        <div className={classes.flex}>
          <Typography variant="body1" gutterBottom>
            집행 금액:&emsp;
          </Typography>
          <Typography variant="h6" gutterBottom>{`${data[1]} 원`}</Typography>
        </div>

        {!usagePerMonthData.loading && (
        <div className={classes.flex}>
            {usagePerMonthData.payload.metaData.map(meta => (
              <div key={meta[1]} className={classes.flex}>
                <Typography variant="body1" gutterBottom>
                  &emsp;
                  {`${meta[0]}: `}
                </Typography>
                <Typography variant="h6" gutterBottom>{` ${meta[1]} 원`}</Typography>
              </div>
            ))}
        </div>
        )}

        <Table
          tableHeaderColor="info"
          tableHead={['집행 날짜', '집행 금액', '광고 타입']}
          tableData={usagePerMonthData.loading
            ? initialData.data
            : usagePerMonthData.payload.data}
          perMonth
        />
      </div>
    </Dialog>
  );
}

CashUsageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};
