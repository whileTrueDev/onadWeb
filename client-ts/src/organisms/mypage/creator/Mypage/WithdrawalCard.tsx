import React from 'react';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import { WithdrawalDataType } from './WithdrawalData.type';

interface WithdrawalCardProps {
  withdrawalData: WithdrawalDataType[];
}
function Mypage({
  withdrawalData
}: WithdrawalCardProps): JSX.Element {
  return (
    <CustomCard iconComponent={(<StyledItemText primary="출금 신청 내역" color="white" />)}>
      <MaterialTable<WithdrawalDataType>
        columns={[
          { title: '출금신청날짜', field: 'date' },
          { title: '출금금액', field: 'creatorWithdrawalAmount' },
          { title: '출금상태', field: 'withdrawalState', lookup: { 1: '완료됨👌', 0: '정산대기⏰' } }
        ]}
        data={withdrawalData}
        style={{ boxShadow: 'none' }}
        options={{
          search: false,
          pageSize: 5,
          pageSizeOptions: [5, 10, 15],
          showTitle: false,
          toolbar: false
        }}
      />
    </CustomCard>
  );
}

export default Mypage;
