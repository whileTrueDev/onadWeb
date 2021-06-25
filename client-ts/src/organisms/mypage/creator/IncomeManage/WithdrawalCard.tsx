import React from 'react';
import moment from 'moment';
import { Paper, TablePagination, Typography } from '@material-ui/core';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import { WithdrawalDataType } from './WithdrawalData.type';

interface WithdrawalCardProps {
  withdrawalData: WithdrawalDataType[];
}
function Mypage({ withdrawalData }: WithdrawalCardProps): JSX.Element {
  const [page, setPage] = React.useState(0);
  return (
    <Paper style={{ padding: 32, minHeight: 400, marginTop: 8 }}>
      <Typography style={{ fontWeight: 'bold' }}>출금 신청 내역</Typography>
      <MaterialTable<WithdrawalDataType>
        columns={[
          {
            title: '출금신청날짜',
            field: 'date',
            render: rowData => moment(rowData.date).format('YYYY년 MM월 DD일'),
          },
          { title: '출금금액', field: 'creatorWithdrawalAmount' },
          {
            title: '출금상태',
            field: 'withdrawalState',
            lookup: { 1: '완료됨👌', 0: '정산대기⏰' },
          },
        ]}
        data={withdrawalData}
        style={{ boxShadow: 'none' }}
        components={{
          // eslint-disable-next-line react/display-name
          Pagination: props => <TablePagination {...props} page={page} />,
        }}
        onChangePage={setPage}
        options={{
          search: false,
          pageSize: 5,
          paginationType: 'stepped',
          pageSizeOptions: [5, 10, 15],
          showTitle: false,
          toolbar: false,
        }}
      />
    </Paper>
  );
}

export default Mypage;
