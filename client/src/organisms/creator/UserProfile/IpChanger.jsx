import React, { useState } from 'react';
import axios from '../../../utils/axios';
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
import Button from '../../../atoms/CustomButtons/Button';
import HOST from '../../../utils/config';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import IpChangerForm from './IpChangerForm';
import history from '../../../history';

const IpChanger = (props) => {
  const {
    classes, localIp, onClose,
  } = props;
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const ipSeperator = (value) => {
    let zeroCount = 0;
    let loopCount = 0;
    const subips = value.split('.');
    const invalidSubips = subips.filter((ip) => {
      if (/\d/.exec(ip)) { loopCount++; }
      if (ip.indexOf('0') === 0) {
        zeroCount++;
      }
      return false;
    });
    return [zeroCount, loopCount];
  };

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
    const value = document.getElementById('ipInput').value.replace(/\s/gi, '');
    const action = ipSeperator(value);
    if (action[0] === 0 && action[1] === 4) {
      axios.post(`${HOST}/api/dashboard/creator/ipchange`, { value })
        .then(handleSnackOpen())
        .then(handleSnackClose())
        .catch((err) => {
          console.log(err);
        });
    } else { alert('IP주소를 다시 확인해주세요.'); }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <IpChangerForm
          classes={classes}
          localIp={localIp}
          handleSnackOpen={handleSnackOpen}
          handleSnackClose={handleSnackClose}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={7} />
      <GridItem xs={12} sm={12} md={5}>
        <Button
          color="info"
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
