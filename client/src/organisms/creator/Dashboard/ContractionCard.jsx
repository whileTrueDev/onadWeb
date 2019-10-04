import React, { useEffect, useState, useCallback } from 'react';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import history from '../../../history';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';
import Contraction from './Contraction/Contraction';

const ContractionCard = () => {
  const [snackOpen, setSnackOpen] = useState(false);

  const [userData, setuserData] = useState({});
  const readyCreatorData = useCallback(() => {
    axios.get(`${HOST}/api/dashboard/creator/profile`)
      .then((res) => {
        if (res.data.error) {
          history.push('/');
        } else {
          console.log(res.data.result);
          setuserData(res.data.result);
        }
      });
  }, []);

  useEffect(() => {
    readyCreatorData();
  }, [readyCreatorData]);


  return (
    userData.creatorContractionAgreement === 0 && (
    <CustomCard iconComponent={<StyledItemText primary="서비스 이용 및 출금 계약하기" style={{ color: '#FFF' }} />}>
      <Contraction setSnackOpen={setSnackOpen} />
      <Snackbar
        place="tr"
        color="success"
        message="성공적으로 계약이 완료되었습니다."
        open={snackOpen}
        icon
        closeNotification={() => {
          setSnackOpen(false);
          history.push('/dashboard/creator/main');
        }}
        close
      />
    </CustomCard>
    )
  );
};

export default ContractionCard;
