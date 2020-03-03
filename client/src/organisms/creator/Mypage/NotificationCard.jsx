import React from 'react';
// @material-ui/core components
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useTestData from '../../../utils/lib/hooks/useTestData';

// core components
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import Table from '../../../atoms/Table/NotificationTable';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

const NotificationCard = () => {
  // const notificationData = useFetchData('/api/dashboard/creator/notification/list');
  const notificationData = useTestData('/marketer/notification/list');


  return (
    <CustomCard
      iconComponent={<StyledItemText primary="내 모든 알림내역" style={{ color: '#FFF' }} />}
    >
      {notificationData.loading && (<CircularProgress small />)}
      {!notificationData.loading && !notificationData.error && (
      <Table
        tableHead={['제목', '내용', '날짜', '확인']}
        tableData={notificationData.payload}
        pagination
      />
      )}

    </CustomCard>
  );
};


export default NotificationCard;
