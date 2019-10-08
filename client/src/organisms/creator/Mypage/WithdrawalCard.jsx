import React from 'react';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import Table from '../../../atoms/Table';
import CustomCard from '../../../atoms/CustomCard';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import StyledItemText from '../../../atoms/StyledItemText';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

const tableHead = [
  {
    label: '출금신청날짜',
    desc: ''
  },
  {
    label: '출금금액',
    desc: ''
  },
  {
    label: '출금상태',
    desc: ''
  },
];

const Mypage = () => {
  const withDrawalData = useFetchData('/api/dashboard/creator/withdrawal/list');

  return (
    <CustomCard iconComponent={<FormatListNumbered />} buttonComponent={<StyledItemText primary="출금 신청 내역" secondary="지금까지의 출금 신청 내역입니다." fontSize="22px" />}>
      {withDrawalData.loading && (<CircularProgress small />)}
      {!withDrawalData.loading && !withDrawalData.error && (
      <Table
        tableHeaderColor="blueGray"
        tableHead={tableHead}
        tableData={withDrawalData.payload.data}
        pagination
      />
      )}
    </CustomCard>
  );
};

export default Mypage;
