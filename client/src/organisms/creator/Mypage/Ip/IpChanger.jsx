import React, { useState } from 'react';
import axios from '../../../../utils/axios';
import GridItem from '../../../../atoms/Grid/GridItem';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import IpChangerForm from './IpChangerForm';
import history from '../../../../history';

const IpChanger = (props) => {
  const {
    localIp, onClose, NowIp
  } = props;
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [newIp, setIp] = useState(null);

  const handleSnackOpen = () => {
    setOpenSnackBar(true);
  };

  function handleSnackClose() {
    setTimeout(() => {
      setOpenSnackBar(false);
      history.push(window.location.pathname);
    },
    1500);
  }

  const IpAdressChanger = (event) => {
    event.preventDefault();
    axios.post(`${HOST}/api/dashboard/creator/ipchange`, { newIp })
      .then(handleSnackOpen())
      .then(handleSnackClose())
      .catch((err) => {
        console.log(err);
      });
    // } else { alert('IP주소를 다시 확인해주세요.'); }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <IpChangerForm
          localIp={localIp}
          handleSnackOpen={handleSnackOpen}
          handleSnackClose={handleSnackClose}
          newIp={newIp}
          setIp={setIp}
          NowIp={NowIp}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={7} />
      <GridItem xs={12} sm={12} md={5}>
        <Button
          color="primary"
          onClick={IpAdressChanger}
        >
          등록
        </Button>
        <Button
          color="blueGray"
          onClick={onClose}
        >
          취소
        </Button>
      </GridItem>
      <Snackbar
        place="tc"
        open={openSnackBar}
        onClose={handleSnackClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">등록 완료</span>}
      />
    </GridContainer>


  );
};

export default IpChanger;
