import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardBody from '../../../../atoms/Card/CardBody';
import Button from '../../../../atoms/CustomButtons/Button';
import axios from '../../../../utils/axios';
import SignOutDialog from './SignOutDialog';
import HOST from '../../../../utils/config';

const SignOut = (props) => {
  const { classes, userData } = props;
  const [open, openState] = useState(false);
  const [marketerId, setMarketerId] = useState();
  const myClass = {
    buttonWrapper: {
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',

    },
  };

  function handleOpen() {
    openState(!open);
  }

  function doSignOut() {
    axios.post(`${HOST}/api/dashboard/marketer/profile/signout`)
      .then(() => {
        alert('탈퇴가 완료되었습니다.');
        // window.location.href = 'https://onad.io';
      });
  }

  useEffect(() => {
    setMarketerId(userData.marketerId);
  }, [userData.marketerId]);

  return (
    <Card>
      <CardBody>
        <div>
          <Typography>
            더 이상 온애드를 사용하시지 않나요?
          </Typography>
        </div>
        <div className={myClass.buttonWrapper}>
          <Button variant="contained" color="danger" onClick={handleOpen}>
          회원탈퇴
          </Button>
        </div>
      </CardBody>
      <SignOutDialog
        handleOpen={handleOpen}
        open={open}
        marketerId={marketerId}
        signOutFunc={doSignOut}
      />
    </Card>
  );
};

export default SignOut;
