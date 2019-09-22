import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Dialog from '../../../../components/Dialog/Dialog';
import useFetchData from '../../../../lib/hooks/useFetchData';
import Table from '../../../../components/Table/CashUsageTable';
import NoTaxBillTooltip from '../../../../components/Tooltip/NoTaxBillTooltip';

const initialData = {
  data: [['-', '-', '-']]
};

export default function CashUsageDialog(props) {
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom>
            집행 금액:&emsp;
          </Typography>
          <Typography variant="h6" gutterBottom>{`${data[1]} 원`}</Typography>
          <Typography variant="body1" gutterBottom>
            &emsp;세금 계산서 발행:&emsp;
          </Typography>
          <Typography variant="h6" gutterBottom>{data[2]}</Typography>
          {data[2] === '미발행' && (
            <NoTaxBillTooltip />
          )}
        </div>

        {!usagePerMonthData.loading && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {usagePerMonthData.payload.metaData.map(meta => (
              <div key={meta[1]} style={{ display: 'flex', alignItems: 'center' }}>
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
