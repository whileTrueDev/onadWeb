import React from 'react';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import Table from '../../../../../atoms/Table/CashUsageTable';

const initialData = {
  data: [['-', '-', '-']]
};

const useStyles = makeStyles(() => ({
  flex: { display: 'flex', alignItems: 'center' }
}));

interface propInterface {
  open: boolean;
  handleClose: () => void;
  data: string[];
}

interface usageInterface {
  data: (string)[][];
  metaData: { type: string, cash: string }[];
}

export default function CashUsageDialog(props: propInterface) {
  const classes = useStyles();
  const { open, handleClose, data } = props;

  const usagePerMonthData = useGetRequest<{ month: string }, usageInterface>('/marketer/cash/history/usage/month', {
    month: data[0] // data[0] = "00년 00월"
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={`${data[0]} 상세보기`} // data[0] = "00년 00월"
      maxWidth="sm"
      fullWidth
    >
      <div>
        <div className={classes.flex}>
          <Typography variant="body1" gutterBottom>
            집행 금액:&emsp;
          </Typography>
          {/* data[1] = 해당 월의 총 광고 집행 금액 */}
          <Typography variant="h6" gutterBottom>{`${data[1]} 원`}</Typography>
        </div>

        {!usagePerMonthData.loading && usagePerMonthData.data && (
          <div className={classes.flex}>
            {usagePerMonthData.data.metaData.map((meta, index: number) => (
              <div key={`month_data_${index}`} className={classes.flex}>
                <Typography variant="body1" gutterBottom>
                  &emsp;
                  {`${meta.type}: `}
                </Typography>
                <Typography variant="h6" gutterBottom>{` ${meta.cash} 원`}</Typography>
              </div>
            ))}
          </div>
        )}
        {!usagePerMonthData.loading && usagePerMonthData.data && (
          <Table
            // tableHeaderColor="info"
            tableHead={['집행 날짜', '집행 금액', '광고 타입']}
            tableData={usagePerMonthData.loading
              ? initialData.data
              : usagePerMonthData.data.data}
            perMonth
          />
        )}
      </div>
    </Dialog>
  );
}
